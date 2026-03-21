"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  RegistrationWithJoins,
  RegistrationStatus,
  PaymentStatus,
} from "@/lib/types/database";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Select, SelectItem, Input } from "@heroui/react";
import { useTournament } from "@/components/admin/TournamentContext";
import { TableSkeleton } from "@/components/admin/AdminLoading";
import {
  REG_STATUS_COLORS,
  PAY_STATUS_COLORS,
} from "@/lib/constants/statusColors";

export default function RegistrationsPage() {
  const { selectedId: selectedTournamentId } = useTournament();
  const [registrations, setRegistrations] = useState<RegistrationWithJoins[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadRegistrations = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/registrations?tournament_id=${selectedTournamentId}`,
    );
    const data = await res.json();
    setRegistrations(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedTournamentId]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  async function updateRegistrationStatus(
    id: string,
    registration_status: RegistrationStatus,
  ) {
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, registration_status }),
    });
    loadRegistrations();
  }

  async function updatePaymentStatus(
    id: string,
    payment_status: PaymentStatus,
  ) {
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, payment_status }),
    });
    loadRegistrations();
  }

  // Filter registrations
  const filtered = registrations.filter((r) => {
    const player = r.player;
    const matchesSearch =
      !search ||
      `${player?.first_name} ${player?.last_name} ${player?.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || r.registration_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paidCount = registrations.filter(
    (r) => r.payment_status === "paid",
  ).length;
  const waiverCount = registrations.filter((r) => r.waiver?.accepted).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Registrations</h1>
        <p className="text-gray-400 text-sm mt-1">
          View, approve, and manage player registrations
        </p>
      </div>

      {/* Stats row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            <strong className="text-white">{registrations.length}</strong>{" "}
            registered
          </span>
          <span>
            <strong className="text-emerald-400">{paidCount}</strong> paid
          </span>
          <span>
            <strong className="text-brand-teal">{waiverCount}</strong> waivers
          </span>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onValueChange={setSearch}
            variant="bordered"
            startContent={
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            variant="bordered"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) =>
              setStatusFilter(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="all">All statuses</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="confirmed">Confirmed</SelectItem>
            <SelectItem key="waitlisted">Waitlisted</SelectItem>
            <SelectItem key="cancelled">Cancelled</SelectItem>
            <SelectItem key="checked_in">Checked In</SelectItem>
            <SelectItem key="no_show">No Show</SelectItem>
          </Select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">No registrations found</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-surface border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waiver
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((reg) => {
                  const player = reg.player;
                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="text-white font-medium">
                          {player?.first_name} {player?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{player?.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={reg.registration_status}
                          onChange={(e) =>
                            updateRegistrationStatus(
                              reg.id,
                              e.target.value as RegistrationStatus,
                            )
                          }
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${REG_STATUS_COLORS[reg.registration_status]}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="waitlisted">Waitlisted</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                          <option value="checked_in">Checked In</option>
                          <option value="no_show">No Show</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={reg.payment_status}
                          onChange={(e) =>
                            updatePaymentStatus(
                              reg.id,
                              e.target.value as PaymentStatus,
                            )
                          }
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${PAY_STATUS_COLORS[reg.payment_status]}`}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        {reg.waiver?.accepted ? (
                          <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-xs text-gray-600">
                          {reg.draft_eligible
                            ? "Draft eligible"
                            : "Not eligible"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

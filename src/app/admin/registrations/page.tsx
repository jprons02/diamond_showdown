"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Tournament,
  RegistrationWithJoins,
  RegistrationStatus,
  PaymentStatus,
} from "@/lib/types/database";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const REG_STATUS_COLORS: Record<RegistrationStatus, string> = {
  pending: "bg-amber-400/10 text-amber-400",
  confirmed: "bg-emerald-400/10 text-emerald-400",
  waitlisted: "bg-purple-400/10 text-purple-400",
  cancelled: "bg-red-400/10 text-red-400",
  refunded: "bg-gray-500/10 text-gray-400",
  checked_in: "bg-brand-teal/10 text-brand-teal",
  no_show: "bg-red-400/10 text-red-400",
};

const PAY_STATUS_COLORS: Record<PaymentStatus, string> = {
  unpaid: "bg-red-400/10 text-red-400",
  pending: "bg-amber-400/10 text-amber-400",
  paid: "bg-emerald-400/10 text-emerald-400",
  refunded: "bg-gray-500/10 text-gray-400",
};

export default function RegistrationsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [registrations, setRegistrations] = useState<RegistrationWithJoins[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const supabase = createClient();

  // Load tournaments for the selector
  useEffect(() => {
    async function loadTournaments() {
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
    loadTournaments();
  }, [supabase]);

  const loadRegistrations = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const { data } = await supabase
      .from("registrations")
      .select("*, player:players(*), waiver:waivers(*)")
      .eq("tournament_id", selectedTournamentId)
      .order("created_at", { ascending: false });
    setRegistrations((data as RegistrationWithJoins[]) ?? []);
    setLoading(false);
  }, [supabase, selectedTournamentId]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  async function updateRegistrationStatus(
    id: string,
    registration_status: RegistrationStatus,
  ) {
    await supabase
      .from("registrations")
      .update({ registration_status })
      .eq("id", id);
    loadRegistrations();
  }

  async function updatePaymentStatus(
    id: string,
    payment_status: PaymentStatus,
  ) {
    await supabase
      .from("registrations")
      .update({ payment_status })
      .eq("id", id);
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

      {/* Tournament selector + stats row */}
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
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-500" />
          <select
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-teal/50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="cancelled">Cancelled</option>
            <option value="checked_in">Checked In</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
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

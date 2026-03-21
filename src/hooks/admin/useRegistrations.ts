import { useEffect, useState, useCallback } from "react";
import type {
  RegistrationWithJoins,
  RegistrationStatus,
  PaymentStatus,
} from "@/lib/types/database";

export function useRegistrations(tournamentId: string | null) {
  const [registrations, setRegistrations] = useState<RegistrationWithJoins[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!tournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/registrations?tournament_id=${tournamentId}`,
    );
    const data = await res.json();
    setRegistrations(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateField(
    id: string,
    field: string,
    value: string | boolean,
  ) {
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
    load();
  }

  async function updateRegistrationStatus(
    id: string,
    registration_status: RegistrationStatus,
  ) {
    await updateField(id, "registration_status", registration_status);
  }

  async function updatePaymentStatus(
    id: string,
    payment_status: PaymentStatus,
  ) {
    await updateField(id, "payment_status", payment_status);
  }

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const p = r.player;
    return `${p?.first_name} ${p?.last_name} ${p?.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const paidCount = registrations.filter(
    (r) => r.payment_status === "paid",
  ).length;
  const waiverCount = registrations.filter((r) => r.waiver?.accepted).length;
  const eligibleCount = registrations.filter((r) => r.draft_eligible).length;

  return {
    registrations,
    filtered,
    loading,
    search,
    setSearch,
    paidCount,
    waiverCount,
    eligibleCount,
    updateField,
    updateRegistrationStatus,
    updatePaymentStatus,
    reload: load,
  };
}

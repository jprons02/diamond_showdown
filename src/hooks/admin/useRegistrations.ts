import { useEffect, useState, useCallback, useRef } from "react";
import type {
  RegistrationWithJoins,
  RegistrationStatus,
  PaymentStatus,
} from "@/lib/types/database";

type FieldUpdates = Record<string, string | boolean>;

export function useRegistrations(tournamentId: string | null) {
  const [registrations, setRegistrations] = useState<RegistrationWithJoins[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Dirty map: { registrationId: { field: newValue, ... } }
  const dirtyRef = useRef<Record<string, FieldUpdates>>({});
  const [dirtyCount, setDirtyCount] = useState(0);

  const load = useCallback(async () => {
    if (!tournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/registrations?tournament_id=${tournamentId}`,
    );
    const data = await res.json();
    setRegistrations(Array.isArray(data) ? data : []);
    dirtyRef.current = {};
    setDirtyCount(0);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  /** Optimistic local-only update — no API call */
  function updateField(id: string, field: string, value: string | boolean) {
    // Track the change
    const prev = dirtyRef.current[id] ?? {};
    dirtyRef.current[id] = { ...prev, [field]: value };
    setDirtyCount(Object.keys(dirtyRef.current).length);

    // Optimistically update local state
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function updateRegistrationStatus(
    id: string,
    registration_status: RegistrationStatus,
  ) {
    updateField(id, "registration_status", registration_status);
  }

  function updatePaymentStatus(id: string, payment_status: PaymentStatus) {
    updateField(id, "payment_status", payment_status);
  }

  /** Persist all dirty rows to the DB in one batch */
  async function saveAll(): Promise<boolean> {
    const entries = Object.entries(dirtyRef.current);
    if (entries.length === 0) return true;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: entries.map(([id, updates]) => ({ id, ...updates })),
        }),
      });
      if (!res.ok) return false;
      dirtyRef.current = {};
      setDirtyCount(0);
      return true;
    } finally {
      setSaving(false);
    }
  }

  function isDirty(id: string) {
    return id in dirtyRef.current;
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
    saving,
    search,
    setSearch,
    paidCount,
    waiverCount,
    eligibleCount,
    dirtyCount,
    isDirty,
    updateField,
    updateRegistrationStatus,
    updatePaymentStatus,
    saveAll,
    reload: load,
  };
}

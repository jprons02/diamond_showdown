import { useEffect, useState, useCallback } from "react";
import type {
  RegistrationWithPlayer,
  CheckInStatus,
} from "@/lib/types/database";

export function useCheckIn(tournamentId: string | null) {
  const [registrations, setRegistrations] = useState<RegistrationWithPlayer[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tournamentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch(
      `/api/admin/registrations?tournament_id=${tournamentId}`,
    );
    const data = await res.json();
    const all: RegistrationWithPlayer[] = Array.isArray(data) ? data : [];
    setRegistrations(
      all.filter((r) =>
        ["confirmed", "checked_in", "no_show"].includes(r.registration_status),
      ),
    );
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function setCheckIn(regId: string, status: CheckInStatus) {
    setActionId(regId);
    const updates: Record<string, unknown> = { check_in_status: status };
    if (status === "checked_in") updates.registration_status = "checked_in";
    else if (status === "no_show") updates.registration_status = "no_show";
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: regId, ...updates }),
    });
    setActionId(null);
    load();
  }

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const p = r.player;
    return `${p?.first_name} ${p?.last_name} ${p?.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const checkedInCount = registrations.filter(
    (r) => r.check_in_status === "checked_in",
  ).length;
  const totalConfirmed = registrations.length;

  return {
    registrations,
    filtered,
    loading,
    search,
    setSearch,
    actionId,
    setCheckIn,
    checkedInCount,
    totalConfirmed,
    reload: load,
  };
}

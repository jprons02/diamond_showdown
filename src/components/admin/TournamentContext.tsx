"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Tournament } from "@/lib/types/database";

interface TournamentContextValue {
  tournaments: Tournament[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  /** The full Tournament object for selectedId, or null */
  selected: Tournament | null;
  loading: boolean;
  /** Re-fetch the tournaments list (e.g. after creating/editing one) */
  refresh: () => Promise<void>;
}

const TournamentContext = createContext<TournamentContextValue | null>(null);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/tournaments");
      const data: Tournament[] = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTournaments(list);

      // Auto-select: keep current selection if still valid, else pick the active tournament
      setSelectedId((prev) => {
        if (prev && list.some((t) => t.id === prev)) return prev;
        const active = list.find(
          (t) => t.status === "open" || t.status === "closed",
        );
        return active?.id ?? list[0]?.id ?? "";
      });
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = tournaments.find((t) => t.id === selectedId) ?? null;

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        selectedId,
        setSelectedId,
        selected,
        loading,
        refresh: load,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return ctx;
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tournament, TournamentStatus } from "@/lib/types/database";
import {
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface ToggleItem {
  key: "standings_visible" | "bracket_published" | "scores_live";
  label: string;
  description: string;
}

const TOGGLES: ToggleItem[] = [
  {
    key: "standings_visible",
    label: "Standings Visible",
    description: "Show pool standings on the public site",
  },
  {
    key: "bracket_published",
    label: "Bracket Published",
    description: "Make the tournament bracket visible to the public",
  },
  {
    key: "scores_live",
    label: "Live Scores",
    description:
      "Show game scores in real-time on the public site. When off, scores are hidden until manually published.",
  },
];

const STATUS_OPTIONS: {
  value: TournamentStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "draft",
    label: "Draft",
    description: "Tournament is not visible to the public",
  },
  {
    value: "open",
    label: "Open",
    description: "Registration is open and the tournament is visible",
  },
  {
    value: "closed",
    label: "Closed",
    description: "Registration is closed, tournament is active",
  },
  {
    value: "completed",
    label: "Completed",
    description: "Tournament has ended, results are final",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Tournament has been cancelled",
  },
];

export default function SettingsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
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
    load();
  }, [supabase]);

  const loadTournament = useCallback(async () => {
    if (!selectedTournamentId) return;
    const { data } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", selectedTournamentId)
      .single();
    setTournament(data);
  }, [supabase, selectedTournamentId]);

  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

  async function handleToggle(key: ToggleItem["key"]) {
    if (!tournament) return;
    setSaving(true);
    const newValue = !tournament[key];
    await supabase
      .from("tournaments")
      .update({ [key]: newValue })
      .eq("id", tournament.id);
    setTournament({ ...tournament, [key]: newValue });
    setSaving(false);
  }

  async function handleStatusChange(status: TournamentStatus) {
    if (!tournament) return;
    setSaving(true);
    await supabase
      .from("tournaments")
      .update({ status })
      .eq("id", tournament.id);
    setTournament({ ...tournament, status });
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Control what&apos;s visible on the public site
        </p>
      </div>

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

      {loading || !tournament ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tournament Status */}
          <div className="rounded-2xl bg-brand-surface border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheckIcon className="w-5 h-5 text-brand-teal" />
              <h2 className="text-lg font-semibold text-white">
                Tournament Status
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={saving}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    tournament.status === opt.value
                      ? "border-brand-teal/50 bg-brand-teal/5"
                      : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${tournament.status === opt.value ? "text-brand-teal" : "text-white"}`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Public Site Toggles */}
          <div className="rounded-2xl bg-brand-surface border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <GlobeAltIcon className="w-5 h-5 text-brand-teal" />
              <h2 className="text-lg font-semibold text-white">
                Public Site Controls
              </h2>
            </div>
            <div className="space-y-3">
              {TOGGLES.map((toggle) => {
                const isOn = tournament[toggle.key];
                return (
                  <div
                    key={toggle.key}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {isOn ? (
                        <EyeIcon className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          {toggle.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {toggle.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(toggle.key)}
                      disabled={saving}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                        isOn ? "bg-brand-teal" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isOn ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Registration window info */}
          <div className="rounded-2xl bg-brand-surface border border-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-3">
              Registration Window
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Opens</p>
                <p className="text-white">
                  {tournament.registration_open
                    ? new Date(tournament.registration_open).toLocaleString()
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Closes</p>
                <p className="text-white">
                  {tournament.registration_close
                    ? new Date(tournament.registration_close).toLocaleString()
                    : "Not set"}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Edit registration dates on the Tournaments page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

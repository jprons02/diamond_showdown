"use client";

import { useEffect, useState, useCallback } from "react";
import type { Tournament, TournamentStatus } from "@/lib/types/database";
import { useTournament } from "@/components/admin/TournamentContext";
import { RowSkeleton, SaveSpinner } from "@/components/admin/AdminLoading";
import { Button, Switch } from "@heroui/react";
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
  const { selectedId: selectedTournamentId, refresh: refreshTournaments } =
    useTournament();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const loadTournament = useCallback(async () => {
    if (!selectedTournamentId) {
      setTournament(null);
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/tournaments");
    const list: Tournament[] = await res.json();
    const found = Array.isArray(list)
      ? (list.find((t) => t.id === selectedTournamentId) ?? null)
      : null;
    setTournament(found);
    setLoading(false);
  }, [selectedTournamentId]);

  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

  async function handleToggle(key: ToggleItem["key"]) {
    if (!tournament) return;
    setSaving(true);
    setSavingKey(key);
    const newValue = !tournament[key];
    await fetch("/api/admin/tournaments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tournament.id, [key]: newValue }),
    });
    setTournament({ ...tournament, [key]: newValue });
    setSavingKey(null);
    setSaving(false);
    refreshTournaments();
  }

  async function handleStatusChange(status: TournamentStatus) {
    if (!tournament) return;
    setSaving(true);
    setSavingKey(`status-${status}`);
    await fetch("/api/admin/tournaments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tournament.id, status }),
    });
    setTournament({ ...tournament, status });
    setSavingKey(null);
    setSaving(false);
    refreshTournaments();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Control what&apos;s visible on the public site
        </p>
      </div>

      {loading || !tournament ? (
        <RowSkeleton count={3} height="h-20" />
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
                <Button
                  key={opt.value}
                  variant={
                    tournament.status === opt.value ? "flat" : "bordered"
                  }
                  color={
                    tournament.status === opt.value ? "primary" : "default"
                  }
                  onPress={() => handleStatusChange(opt.value)}
                  isDisabled={saving}
                  className="h-auto p-4 flex-col items-start text-left"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{opt.label}</p>
                    {savingKey === `status-${opt.value}` && (
                      <SaveSpinner className="w-3 h-3" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 whitespace-normal">
                    {opt.description}
                  </p>
                </Button>
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
                    <Switch
                      isSelected={isOn}
                      isDisabled={saving}
                      onValueChange={() => handleToggle(toggle.key)}
                      size="sm"
                      color="success"
                    />
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

"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  Tournament,
  Team,
  TeamPlayer,
  TeamWithPlayers,
} from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  UserPlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { Select, SelectItem, Button, Input } from "@heroui/react";
import { TournamentSelector } from "@/components/admin/TournamentSelector";
import { RowSkeleton } from "@/components/admin/AdminLoading";

export default function TeamsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [teams, setTeams] = useState<TeamWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  // Team form
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    seed: "",
    color: "",
    coach_name: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTournaments() {
      const res = await fetch("/api/admin/tournaments");
      const list: Tournament[] = await res.json();
      setTournaments(Array.isArray(list) ? list : []);
      if (list.length > 0) {
        const active = list.find(
          (t) => t.status === "open" || t.status === "closed",
        );
        setSelectedTournamentId(active?.id ?? list[0].id);
      }
      setLoading(false);
    }
    loadTournaments();
  }, []);

  const loadTeams = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/teams?tournament_id=${selectedTournamentId}&include_players=true`,
    );
    const data = await res.json();
    setTeams(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedTournamentId]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  function openCreateTeam() {
    setEditingTeamId(null);
    setTeamForm({ name: "", seed: "", color: "", coach_name: "" });
    setShowTeamForm(true);
  }

  function openEditTeam(t: TeamWithPlayers) {
    setEditingTeamId(t.id);
    setTeamForm({
      name: t.name,
      seed: t.seed?.toString() ?? "",
      color: t.color ?? "",
      coach_name: t.coach_name ?? "",
    });
    setShowTeamForm(true);
  }

  async function handleSaveTeam(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      tournament_id: selectedTournamentId,
      name: teamForm.name,
      seed: teamForm.seed ? parseInt(teamForm.seed) : null,
      color: teamForm.color || null,
      coach_name: teamForm.coach_name || null,
    };
    if (editingTeamId) {
      await fetch("/api/admin/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingTeamId, ...payload }),
      });
    } else {
      await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowTeamForm(false);
    loadTeams();
  }

  async function handleDeleteTeam(id: string) {
    if (!confirm("Delete this team and all roster assignments?")) return;
    await fetch(`/api/admin/teams?id=${id}`, { method: "DELETE" });
    loadTeams();
  }

  async function toggleCaptain(tp: TeamPlayer) {
    await fetch("/api/admin/team-players", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tp.id, is_captain: !tp.is_captain }),
    });
    loadTeams();
  }

  async function removeFromRoster(tp: TeamPlayer) {
    if (!confirm("Remove this player from the team?")) return;
    await fetch(`/api/admin/team-players?id=${tp.id}`, { method: "DELETE" });
    loadTeams();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Teams & Rosters</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage teams and player assignments after the draft
          </p>
        </div>
        <Button
          onPress={openCreateTeam}
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          New Team
        </Button>
      </div>

      {/* Tournament selector */}
      <TournamentSelector
        tournaments={tournaments}
        selectedId={selectedTournamentId}
        onChange={setSelectedTournamentId}
      />

      {/* Teams list */}
      {loading ? (
        <RowSkeleton count={3} height="h-24" />
      ) : teams.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">No teams yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Create teams and assign players after the draft.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => {
            const roster = team.team_players ?? [];
            const isExpanded = expandedTeam === team.id;
            return (
              <div
                key={team.id}
                className="rounded-2xl bg-brand-surface border border-white/5 overflow-hidden"
              >
                {/* Team header */}
                <div className="flex items-center justify-between p-5">
                  <button
                    className="flex items-center gap-3 text-left min-w-0 flex-1"
                    onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                  >
                    {team.color && (
                      <div
                        className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                        style={{ backgroundColor: team.color }}
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold truncate">
                          {team.name}
                        </h3>
                        {team.seed && (
                          <span className="text-xs text-gray-500">
                            Seed #{team.seed}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {roster.length} player{roster.length !== 1 ? "s" : ""}
                        {team.coach_name ? ` • Coach: ${team.coach_name}` : ""}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUpIcon className="w-4 h-4 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </button>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => openEditTeam(team)}
                      title="Edit team"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      color="danger"
                      onPress={() => handleDeleteTeam(team.id)}
                      title="Delete team"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded roster */}
                {isExpanded && (
                  <div className="border-t border-white/5 px-5 py-4">
                    {roster.length === 0 ? (
                      <p className="text-sm text-gray-500 py-2">
                        No players assigned yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {roster.map((tp) => {
                          const player = tp.registration?.player;
                          return (
                            <div
                              key={tp.id}
                              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02]"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-600 w-6 text-center">
                                  #{tp.draft_pick_number ?? "—"}
                                </span>
                                <div>
                                  <p className="text-sm text-white">
                                    {player?.first_name} {player?.last_name}
                                    {tp.is_captain && (
                                      <span className="ml-2 text-xs bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full">
                                        Captain
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {player?.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  color={tp.is_captain ? "warning" : "default"}
                                  onPress={() => toggleCaptain(tp)}
                                >
                                  {tp.is_captain
                                    ? "Remove Captain"
                                    : "Make Captain"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => removeFromRoster(tp)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Team form modal */}
      {showTeamForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowTeamForm(false)}
          />
          <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingTeamId ? "Edit Team" : "New Team"}
              </h2>
              <Button
                isIconOnly
                variant="light"
                onPress={() => setShowTeamForm(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4">
              <Input
                isRequired
                label="Team Name"
                variant="bordered"
                value={teamForm.name}
                onValueChange={(v) => setTeamForm({ ...teamForm, name: v })}
                placeholder="Team Alpha"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Seed"
                  variant="bordered"
                  value={teamForm.seed}
                  onValueChange={(v) => setTeamForm({ ...teamForm, seed: v })}
                  placeholder="1"
                />
                <Input
                  type="color"
                  label="Color"
                  variant="bordered"
                  value={teamForm.color || "#0ED3CF"}
                  onValueChange={(v) => setTeamForm({ ...teamForm, color: v })}
                  classNames={{ label: "mb-2" }}
                />
              </div>
              <Input
                label="Coach Name"
                variant="bordered"
                value={teamForm.coach_name}
                onValueChange={(v) =>
                  setTeamForm({ ...teamForm, coach_name: v })
                }
                placeholder="Optional"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="bordered"
                  onPress={() => setShowTeamForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" isLoading={saving}>
                  {saving
                    ? "Saving…"
                    : editingTeamId
                      ? "Update"
                      : "Create Team"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

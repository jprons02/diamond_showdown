"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
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

  const supabase = createClient();

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

  const loadTeams = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const { data } = await supabase
      .from("teams")
      .select(
        "*, team_players(*, registration:registrations(*, player:players(*)))",
      )
      .eq("tournament_id", selectedTournamentId)
      .order("seed", { ascending: true });
    setTeams((data as TeamWithPlayers[]) ?? []);
    setLoading(false);
  }, [supabase, selectedTournamentId]);

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
      await supabase.from("teams").update(payload).eq("id", editingTeamId);
    } else {
      await supabase.from("teams").insert(payload);
    }
    setSaving(false);
    setShowTeamForm(false);
    loadTeams();
  }

  async function handleDeleteTeam(id: string) {
    if (!confirm("Delete this team and all roster assignments?")) return;
    await supabase.from("teams").delete().eq("id", id);
    loadTeams();
  }

  async function toggleCaptain(tp: TeamPlayer) {
    await supabase
      .from("team_players")
      .update({ is_captain: !tp.is_captain })
      .eq("id", tp.id);
    loadTeams();
  }

  async function removeFromRoster(tp: TeamPlayer) {
    if (!confirm("Remove this player from the team?")) return;
    await supabase.from("team_players").delete().eq("id", tp.id);
    loadTeams();
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Teams & Rosters</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage teams and player assignments after the draft
          </p>
        </div>
        <button
          onClick={openCreateTeam}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          New Team
        </button>
      </div>

      {/* Tournament selector */}
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

      {/* Teams list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
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
                    <button
                      onClick={() => openEditTeam(team)}
                      className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                      title="Edit team"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete team"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
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
                                <button
                                  onClick={() => toggleCaptain(tp)}
                                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                                    tp.is_captain
                                      ? "bg-amber-400/10 text-amber-400"
                                      : "text-gray-500 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  {tp.is_captain
                                    ? "Remove Captain"
                                    : "Make Captain"}
                                </button>
                                <button
                                  onClick={() => removeFromRoster(tp)}
                                  className="text-xs px-2.5 py-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                >
                                  Remove
                                </button>
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
              <button
                onClick={() => setShowTeamForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4">
              <div>
                <label className={labelCls}>Team Name *</label>
                <input
                  required
                  className={inputCls}
                  value={teamForm.name}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, name: e.target.value })
                  }
                  placeholder="Team Alpha"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Seed</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={teamForm.seed}
                    onChange={(e) =>
                      setTeamForm({ ...teamForm, seed: e.target.value })
                    }
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className={labelCls}>Color</label>
                  <input
                    type="color"
                    className="w-full h-[42px] rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                    value={teamForm.color || "#0ED3CF"}
                    onChange={(e) =>
                      setTeamForm({ ...teamForm, color: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Coach Name</label>
                <input
                  className={inputCls}
                  value={teamForm.coach_name}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, coach_name: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeamForm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving
                    ? "Saving…"
                    : editingTeamId
                      ? "Update"
                      : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

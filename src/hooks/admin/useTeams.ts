import { useEffect, useState, useCallback } from "react";
import type { TeamWithPlayers } from "@/lib/types/database";

interface TeamForm {
  name: string;
  seed: string;
  color: string;
  coach_name: string;
}

export function useTeams(tournamentId: string | null) {
  const [teams, setTeams] = useState<TeamWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamForm>({
    name: "",
    seed: "",
    color: "",
    coach_name: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!tournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/teams?tournament_id=${tournamentId}&include_players=true`,
    );
    const data = await res.json();
    setTeams(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm({
      name: "",
      seed: String(teams.length + 1),
      color: "",
      coach_name: "",
    });
    setShowForm(true);
  }

  function openEdit(t: TeamWithPlayers) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      seed: t.seed?.toString() ?? "",
      color: t.color ?? "",
      coach_name: t.coach_name ?? "",
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      tournament_id: tournamentId,
      name: form.name,
      seed: form.seed ? parseInt(form.seed) : null,
      color: form.color || null,
      coach_name: form.coach_name || null,
    };
    if (editingId) {
      await fetch("/api/admin/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team and all roster assignments?")) return;
    await fetch(`/api/admin/teams?id=${id}`, { method: "DELETE" });
    load();
  }

  return {
    teams,
    loading,
    showForm,
    setShowForm,
    editingId,
    form,
    setForm,
    saving,
    openCreate,
    openEdit,
    handleSave,
    handleDelete,
    reload: load,
  };
}

"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  Tournament,
  Announcement,
  AnnouncementAudience,
} from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { TournamentSelector } from "@/components/admin/TournamentSelector";

export default function AnnouncementsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    audience: "all" as AnnouncementAudience,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  const loadAnnouncements = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/announcements?tournament_id=${selectedTournamentId}`,
    );
    const data = await res.json();
    setAnnouncements(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedTournamentId]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  function openCreate() {
    setEditingId(null);
    setForm({ title: "", body: "", audience: "all" });
    setShowForm(true);
  }

  function openEdit(a: Announcement) {
    setEditingId(a.id);
    setForm({ title: a.title, body: a.body ?? "", audience: a.audience });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      tournament_id: selectedTournamentId,
      title: form.title,
      body: form.body || null,
      audience: form.audience,
    };
    if (editingId) {
      await fetch("/api/admin/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    loadAnnouncements();
  }

  async function togglePublish(a: Announcement) {
    const published_at = a.published_at ? null : new Date().toISOString();
    await fetch("/api/admin/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, published_at }),
    });
    loadAnnouncements();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    loadAnnouncements();
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">
            Post updates for players and teams
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      <TournamentSelector
        tournaments={tournaments}
        selectedId={selectedTournamentId}
        onChange={setSelectedTournamentId}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl bg-brand-surface border border-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{a.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${a.published_at ? "bg-emerald-400/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"}`}
                    >
                      {a.published_at ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-600 capitalize">
                      {a.audience}
                    </span>
                  </div>
                  {a.body && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {a.body}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePublish(a)}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    title={a.published_at ? "Unpublish" : "Publish"}
                  >
                    {a.published_at ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Edit Announcement" : "New Announcement"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input
                  required
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Schedule Update"
                />
              </div>
              <div>
                <label className={labelCls}>Body</label>
                <textarea
                  rows={4}
                  className={inputCls}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Details of the announcement…"
                />
              </div>
              <div>
                <label className={labelCls}>Audience</label>
                <select
                  className={inputCls}
                  value={form.audience}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      audience: e.target.value as AnnouncementAudience,
                    })
                  }
                >
                  <option value="all">Everyone</option>
                  <option value="players">Players Only</option>
                  <option value="coaches">Coaches Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                    : editingId
                      ? "Update"
                      : "Post Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

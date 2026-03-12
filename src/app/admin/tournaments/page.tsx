"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tournament, TournamentStatus } from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const STATUS_OPTIONS: TournamentStatus[] = [
  "draft",
  "open",
  "closed",
  "completed",
  "cancelled",
];
const STATUS_COLORS: Record<TournamentStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400",
  open: "bg-emerald-400/10 text-emerald-400",
  closed: "bg-amber-400/10 text-amber-400",
  completed: "bg-brand-teal/10 text-brand-teal",
  cancelled: "bg-red-400/10 text-red-400",
};

interface TournamentFormData {
  name: string;
  slug: string;
  event_date: string;
  location_name: string;
  location_address: string;
  registration_open: string;
  registration_close: string;
  draft_datetime: string;
  max_players: string;
  entry_fee: string;
  status: TournamentStatus;
  rules_text: string;
}

const EMPTY_FORM: TournamentFormData = {
  name: "",
  slug: "",
  event_date: "",
  location_name: "",
  location_address: "",
  registration_open: "",
  registration_close: "",
  draft_datetime: "",
  max_players: "",
  entry_fee: "",
  status: "draft",
  rules_text: "",
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TournamentFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const loadTournaments = useCallback(async () => {
    const { data } = await supabase
      .from("tournaments")
      .select("*")
      .order("event_date", { ascending: false });
    setTournaments(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  function slugify(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEditForm(t: Tournament) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      slug: t.slug,
      event_date: t.event_date ?? "",
      location_name: t.location_name ?? "",
      location_address: t.location_address ?? "",
      registration_open: t.registration_open?.slice(0, 16) ?? "",
      registration_close: t.registration_close?.slice(0, 16) ?? "",
      draft_datetime: t.draft_datetime?.slice(0, 16) ?? "",
      max_players: t.max_players?.toString() ?? "",
      entry_fee: t.entry_fee?.toString() ?? "",
      status: t.status,
      rules_text: t.rules_text ?? "",
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      event_date: form.event_date || null,
      location_name: form.location_name || null,
      location_address: form.location_address || null,
      registration_open: form.registration_open || null,
      registration_close: form.registration_close || null,
      draft_datetime: form.draft_datetime || null,
      max_players: form.max_players ? parseInt(form.max_players) : null,
      entry_fee: form.entry_fee ? parseFloat(form.entry_fee) : null,
      status: form.status,
      rules_text: form.rules_text || null,
    };

    if (editingId) {
      await supabase.from("tournaments").update(payload).eq("id", editingId);
    } else {
      await supabase.from("tournaments").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    loadTournaments();
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this tournament? This cannot be undone.",
      )
    )
      return;
    await supabase.from("tournaments").delete().eq("id", id);
    loadTournaments();
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournaments</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage tournament events
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          New Tournament
        </button>
      </div>

      {/* Tournament list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400 mb-2">No tournaments yet</p>
          <p className="text-gray-600 text-sm">
            Click &ldquo;New Tournament&rdquo; to create your first event.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-brand-surface border border-white/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold truncate">
                    {t.name}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[t.status]}`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t.event_date
                    ? new Date(t.event_date + "T00:00:00").toLocaleDateString()
                    : "No date set"}
                  {t.location_name ? ` • ${t.location_name}` : ""}
                  {t.max_players ? ` • ${t.max_players} max players` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditForm(t)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  title="Edit"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Edit Tournament" : "New Tournament"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tournament Name *</label>
                  <input
                    required
                    className={inputCls}
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug: form.slug || slugify(e.target.value),
                      })
                    }
                    placeholder="Spring Classic 2026"
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input
                    className={inputCls}
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="spring-classic-2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Event Date</label>
                  <input
                    type="date"
                    className={inputCls}
                    value={form.event_date}
                    onChange={(e) =>
                      setForm({ ...form, event_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    className={inputCls}
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as TournamentStatus,
                      })
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Location Name</label>
                  <input
                    className={inputCls}
                    value={form.location_name}
                    onChange={(e) =>
                      setForm({ ...form, location_name: e.target.value })
                    }
                    placeholder="City Park Fields"
                  />
                </div>
                <div>
                  <label className={labelCls}>Location Address</label>
                  <input
                    className={inputCls}
                    value={form.location_address}
                    onChange={(e) =>
                      setForm({ ...form, location_address: e.target.value })
                    }
                    placeholder="123 Main St, City, ST"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Registration Opens</label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={form.registration_open}
                    onChange={(e) =>
                      setForm({ ...form, registration_open: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Registration Closes</label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={form.registration_close}
                    onChange={(e) =>
                      setForm({ ...form, registration_close: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Draft Date/Time</label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={form.draft_datetime}
                    onChange={(e) =>
                      setForm({ ...form, draft_datetime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Max Players</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.max_players}
                    onChange={(e) =>
                      setForm({ ...form, max_players: e.target.value })
                    }
                    placeholder="64"
                  />
                </div>
                <div>
                  <label className={labelCls}>Entry Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputCls}
                    value={form.entry_fee}
                    onChange={(e) =>
                      setForm({ ...form, entry_fee: e.target.value })
                    }
                    placeholder="50.00"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Rules / Notes</label>
                <textarea
                  rows={4}
                  className={inputCls}
                  value={form.rules_text}
                  onChange={(e) =>
                    setForm({ ...form, rules_text: e.target.value })
                  }
                  placeholder="Optional rules or notes for this tournament..."
                />
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
                      ? "Update Tournament"
                      : "Create Tournament"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

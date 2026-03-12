"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tournament, Field } from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function FieldsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", sort_order: "", notes: "" });
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

  const loadFields = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const { data } = await supabase
      .from("fields")
      .select("*")
      .eq("tournament_id", selectedTournamentId)
      .order("sort_order", { ascending: true });
    setFields(data ?? []);
    setLoading(false);
  }, [supabase, selectedTournamentId]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  function openCreate() {
    setEditingId(null);
    setForm({ name: "", sort_order: String(fields.length + 1), notes: "" });
    setShowForm(true);
  }

  function openEdit(f: Field) {
    setEditingId(f.id);
    setForm({
      name: f.name,
      sort_order: String(f.sort_order),
      notes: f.notes ?? "",
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      tournament_id: selectedTournamentId,
      name: form.name,
      sort_order: parseInt(form.sort_order) || 0,
      notes: form.notes || null,
    };
    if (editingId) {
      await supabase.from("fields").update(payload).eq("id", editingId);
    } else {
      await supabase.from("fields").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    loadFields();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this field?")) return;
    await supabase.from("fields").delete().eq("id", id);
    loadFields();
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fields</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage diamonds and playing fields
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          Add Field
        </button>
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

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
      ) : fields.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">No fields configured</p>
          <p className="text-gray-600 text-sm mt-1">
            Add your playing diamonds above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className="rounded-2xl bg-brand-surface border border-white/5 p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">{field.name}</h3>
                {field.notes && (
                  <p className="text-xs text-gray-500 mt-0.5">{field.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 mr-2">
                  Order: {field.sort_order}
                </span>
                <button
                  onClick={() => openEdit(field)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(field.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Edit Field" : "Add Field"}
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
                <label className={labelCls}>Field Name *</label>
                <input
                  required
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Diamond A"
                />
              </div>
              <div>
                <label className={labelCls}>Sort Order</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <input
                  className={inputCls}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Outfield fence, lights, etc."
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
                  {saving ? "Saving…" : editingId ? "Update" : "Add Field"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

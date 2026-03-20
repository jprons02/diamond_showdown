"use client";

import { useEffect, useState, useCallback } from "react";
import type { Field } from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Input } from "@heroui/react";
import { useTournament } from "@/components/admin/TournamentContext";
import { RowSkeleton } from "@/components/admin/AdminLoading";

export default function FieldsPage() {
  const { selectedId: selectedTournamentId, loading: tournamentsLoading } =
    useTournament();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", sort_order: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const loadFields = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/fields?tournament_id=${selectedTournamentId}`,
    );
    const data = await res.json();
    setFields(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedTournamentId]);

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
      await fetch("/api/admin/fields", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    loadFields();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this field?")) return;
    await fetch(`/api/admin/fields?id=${id}`, { method: "DELETE" });
    loadFields();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fields</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage diamonds and playing fields
          </p>
        </div>
        <Button
          onPress={openCreate}
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          Add Field
        </Button>
      </div>

      {tournamentsLoading || loading ? (
        <RowSkeleton count={3} height="h-16" />
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
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => openEdit(field)}
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  color="danger"
                  onPress={() => handleDelete(field.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
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
              <Button
                isIconOnly
                variant="light"
                onPress={() => setShowForm(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                isRequired
                label="Field Name"
                variant="bordered"
                value={form.name}
                onValueChange={(v) => setForm({ ...form, name: v })}
                placeholder="Diamond A"
              />
              <Input
                type="number"
                label="Sort Order"
                variant="bordered"
                value={form.sort_order}
                onValueChange={(v) => setForm({ ...form, sort_order: v })}
              />
              <Input
                label="Notes"
                variant="bordered"
                value={form.notes}
                onValueChange={(v) => setForm({ ...form, notes: v })}
                placeholder="Outfield fence, lights, etc."
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="bordered" onPress={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" isLoading={saving}>
                  {saving ? "Saving…" : editingId ? "Update" : "Add Field"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

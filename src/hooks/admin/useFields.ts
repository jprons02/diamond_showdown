import { useEffect, useState, useCallback } from "react";
import type { Field } from "@/lib/types/database";

interface FieldForm {
  name: string;
  sort_order: string;
  notes: string;
}

export function useFields(tournamentId: string | null) {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FieldForm>({
    name: "",
    sort_order: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!tournamentId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/fields?tournament_id=${tournamentId}`);
    const data = await res.json();
    setFields(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

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
      tournament_id: tournamentId,
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
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this field?")) return;
    await fetch(`/api/admin/fields?id=${id}`, { method: "DELETE" });
    load();
  }

  return {
    fields,
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

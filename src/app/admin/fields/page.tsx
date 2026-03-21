"use client";

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
import { useFields } from "@/hooks/admin/useFields";

export default function FieldsPage() {
  const { selectedId: selectedTournamentId, loading: tournamentsLoading } =
    useTournament();
  const {
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
  } = useFields(selectedTournamentId ?? "");

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

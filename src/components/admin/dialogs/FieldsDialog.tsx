"use client";

import { Button, Input } from "@heroui/react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DialogShell } from "@/components/admin/DialogShell";
import { useFields } from "@/hooks/admin/useFields";

export function FieldsDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
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
    handleSave: baseSave,
    handleDelete: baseDelete,
  } = useFields(tournamentId);

  async function handleSave(e: React.FormEvent) {
    await baseSave(e);
    onDataChange();
  }

  async function handleDelete(id: string) {
    await baseDelete(id);
    onDataChange();
  }

  return (
    <DialogShell
      title="Manage Fields"
      onClose={onClose}
      fullPageHref="/admin/fields"
    >
      <div className="space-y-4">
        <Button
          size="sm"
          color="primary"
          onPress={openCreate}
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          Add Field
        </Button>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : fields.length === 0 ? (
          <p className="text-sm text-gray-500">
            No fields yet. Add your first field above.
          </p>
        ) : (
          <div className="space-y-2">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div>
                  <p className="text-sm text-white font-medium">{field.name}</p>
                  {field.notes && (
                    <p className="text-xs text-gray-500">{field.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
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
          <form
            onSubmit={handleSave}
            className="space-y-3 pt-3 border-t border-white/5"
          >
            <p className="text-sm font-medium text-white">
              {editingId ? "Edit Field" : "New Field"}
            </p>
            <Input
              isRequired
              size="sm"
              label="Field Name"
              variant="bordered"
              value={form.name}
              onValueChange={(v) => setForm({ ...form, name: v })}
              placeholder="Diamond A"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                size="sm"
                type="number"
                label="Sort Order"
                variant="bordered"
                value={form.sort_order}
                onValueChange={(v) => setForm({ ...form, sort_order: v })}
              />
              <Input
                size="sm"
                label="Notes"
                variant="bordered"
                value={form.notes}
                onValueChange={(v) => setForm({ ...form, notes: v })}
                placeholder="Optional"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                color="primary"
                isLoading={saving}
              >
                {editingId ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DialogShell>
  );
}

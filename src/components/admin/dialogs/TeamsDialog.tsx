"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DialogShell } from "@/components/admin/DialogShell";
import { useTeams } from "@/hooks/admin/useTeams";
import { TEAM_COLORS } from "@/lib/constants/statusColors";

export function TeamsDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const {
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
    handleSave: baseSave,
    handleDelete: baseDelete,
  } = useTeams(tournamentId);

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
      title="Manage Teams"
      onClose={onClose}
      fullPageHref="/admin/teams"
    >
      <div className="space-y-4">
        <Button
          size="sm"
          color="primary"
          onPress={openCreate}
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          New Team
        </Button>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : teams.length === 0 ? (
          <p className="text-sm text-gray-500">
            No teams yet. Create your first team above.
          </p>
        ) : (
          <div className="space-y-2">
            {teams.map((team) => {
              const rosterCount = team.team_players?.length ?? 0;
              return (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    {team.color && (
                      <div
                        className="w-3 h-3 rounded-full shrink-0 border border-white/10"
                        style={{ backgroundColor: team.color }}
                      />
                    )}
                    <div>
                      <p className="text-sm text-white font-medium">
                        {team.name}
                        {team.seed && (
                          <span className="text-xs text-gray-500 ml-2">
                            #{team.seed}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rosterCount} player{rosterCount !== 1 ? "s" : ""}
                        {team.coach_name ? ` · Coach: ${team.coach_name}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => openEdit(team)}
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      color="danger"
                      onPress={() => handleDelete(team.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSave}
            className="space-y-3 pt-3 border-t border-white/5"
          >
            <p className="text-sm font-medium text-white">
              {editingId ? "Edit Team" : "New Team"}
            </p>
            <Input
              isRequired
              size="sm"
              label="Team Name"
              variant="bordered"
              value={form.name}
              onValueChange={(v) => setForm({ ...form, name: v })}
              placeholder="Team Alpha"
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                size="sm"
                type="number"
                label="Seed"
                variant="bordered"
                value={form.seed}
                onValueChange={(v) => setForm({ ...form, seed: v })}
              />
              <Select
                size="sm"
                label="Color"
                variant="bordered"
                selectedKeys={form.color ? [form.color] : []}
                onSelectionChange={(keys) =>
                  setForm({
                    ...form,
                    color: (Array.from(keys)[0] as string) ?? "",
                  })
                }
                scrollShadowProps={{ hideScrollBar: false }}
                classNames={{ listboxWrapper: "max-h-44" }}
                renderValue={(items) =>
                  items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: item.key as string }}
                      />
                      <span>{item.textValue}</span>
                    </div>
                  ))
                }
              >
                {TEAM_COLORS.map((c) => (
                  <SelectItem
                    key={c.value}
                    textValue={c.label}
                    startContent={
                      <div
                        className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.value }}
                      />
                    }
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                size="sm"
                label="Coach"
                variant="bordered"
                value={form.coach_name}
                onValueChange={(v) => setForm({ ...form, coach_name: v })}
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
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DialogShell>
  );
}

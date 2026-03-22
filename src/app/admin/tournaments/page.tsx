"use client";

import { useState } from "react";
import type { Tournament, TournamentStatus } from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { RowSkeleton } from "@/components/admin/AdminLoading";
import { TournamentFormDialog } from "@/components/admin/dialogs";
import { useTournament } from "@/components/admin/TournamentContext";

const STATUS_COLORS: Record<TournamentStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400",
  open: "bg-emerald-400/10 text-emerald-400",
  closed: "bg-amber-400/10 text-amber-400",
  completed: "bg-brand-teal/10 text-brand-teal",
  cancelled: "bg-red-400/10 text-red-400",
};

export default function TournamentsPage() {
  const { tournaments, loading, refresh } = useTournament();
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(
    null,
  );

  function openCreateForm() {
    setEditingTournament(null);
    setShowForm(true);
  }

  function openEditForm(t: Tournament) {
    setEditingTournament(t);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this tournament? This cannot be undone.",
      )
    )
      return;
    await fetch(`/api/admin/tournaments?id=${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournaments</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage tournament events
          </p>
        </div>
        <Button
          color="primary"
          onPress={openCreateForm}
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          New Tournament
        </Button>
      </div>

      {/* Tournament list */}
      {loading ? (
        <RowSkeleton count={3} height="h-20" />
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
                  {t.event_end_date && t.event_end_date !== t.event_date
                    ? ` – ${new Date(t.event_end_date + "T00:00:00").toLocaleDateString()}`
                    : ""}
                  {t.location_name ? ` • ${t.location_name}` : ""}
                  {t.max_players ? ` • ${t.max_players} max players` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => openEditForm(t)}
                  title="Edit"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  color="danger"
                  onPress={() => handleDelete(t.id)}
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Form Dialog */}
      {showForm && (
        <TournamentFormDialog
          tournament={editingTournament}
          onClose={() => setShowForm(false)}
          onSaved={refresh}
        />
      )}
    </div>
  );
}

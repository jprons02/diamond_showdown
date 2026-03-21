"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import type { Tournament, TournamentStatus } from "@/lib/types/database";
import { DialogShell } from "@/components/admin/DialogShell";

export function StatusChangeDialog({
  tournament,
  targetStatus,
  title,
  description,
  onClose,
  onDataChange,
}: {
  tournament: Tournament;
  targetStatus: TournamentStatus;
  title: string;
  description: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const alreadySet = tournament.status === targetStatus;

  async function handleChange() {
    setSaving(true);
    await fetch("/api/admin/tournaments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tournament.id, status: targetStatus }),
    });
    setSaving(false);
    onDataChange();
    onClose();
  }

  return (
    <DialogShell title={title} onClose={onClose} fullPageHref="/admin/settings">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">{description}</p>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div>
            <p className="text-xs text-gray-500">Current status</p>
            <p className="text-sm text-white font-medium capitalize">
              {tournament.status}
            </p>
          </div>
          <span className="text-gray-600">→</span>
          <div>
            <p className="text-xs text-gray-500">New status</p>
            <p className="text-sm text-brand-teal font-medium capitalize">
              {targetStatus}
            </p>
          </div>
        </div>
        {alreadySet ? (
          <p className="text-sm text-emerald-400">
            Tournament is already &ldquo;{targetStatus}&rdquo;.
          </p>
        ) : (
          <div className="flex justify-end gap-3">
            <Button variant="bordered" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" isLoading={saving} onPress={handleChange}>
              Change to &ldquo;{targetStatus}&rdquo;
            </Button>
          </div>
        )}
      </div>
    </DialogShell>
  );
}

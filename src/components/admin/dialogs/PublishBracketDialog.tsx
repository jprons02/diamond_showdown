"use client";

import { useState } from "react";
import { Switch } from "@heroui/react";
import type { Tournament } from "@/lib/types/database";
import { DialogShell } from "@/components/admin/DialogShell";

export function PublishBracketDialog({
  tournament,
  onClose,
  onDataChange,
}: {
  tournament: Tournament;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const published = tournament.bracket_published;

  async function handleToggle() {
    setSaving(true);
    await fetch("/api/admin/tournaments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: tournament.id,
        bracket_published: !published,
      }),
    });
    setSaving(false);
    onDataChange();
    onClose();
  }

  return (
    <DialogShell
      title="Publish Bracket"
      onClose={onClose}
      fullPageHref="/admin/settings"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          {published
            ? "The bracket is currently visible on the public site. You can unpublish it to hide it."
            : "Publishing makes the bracket visible to all players on the public tournament page."}
        </p>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div>
            <p className="text-sm text-white font-medium">Bracket Published</p>
            <p className="text-xs text-gray-500">
              {published ? "Visible to public" : "Hidden from public"}
            </p>
          </div>
          <Switch
            isSelected={published}
            isDisabled={saving}
            onValueChange={handleToggle}
            size="sm"
            color="success"
          />
        </div>
      </div>
    </DialogShell>
  );
}

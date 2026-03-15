"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  Tournament,
  Announcement,
  AnnouncementAudience,
} from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { TournamentSelector } from "@/components/admin/TournamentSelector";
import { Select, SelectItem, Input, Textarea, Button } from "@heroui/react";
import { RowSkeleton, SaveSpinner } from "@/components/admin/AdminLoading";

export default function AnnouncementsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    audience: "all" as AnnouncementAudience,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/tournaments");
      const list: Tournament[] = await res.json();
      setTournaments(Array.isArray(list) ? list : []);
      if (list.length > 0) {
        const active = list.find(
          (t) => t.status === "open" || t.status === "closed",
        );
        setSelectedTournamentId(active?.id ?? list[0].id);
      }
      setLoading(false);
    }
    load();
  }, []);

  const loadAnnouncements = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/announcements?tournament_id=${selectedTournamentId}`,
    );
    const data = await res.json();
    setAnnouncements(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedTournamentId]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  function openCreate() {
    setEditingId(null);
    setForm({ title: "", body: "", audience: "all" });
    setShowForm(true);
  }

  function openEdit(a: Announcement) {
    setEditingId(a.id);
    setForm({ title: a.title, body: a.body ?? "", audience: a.audience });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      tournament_id: selectedTournamentId,
      title: form.title,
      body: form.body || null,
      audience: form.audience,
    };
    if (editingId) {
      await fetch("/api/admin/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    loadAnnouncements();
  }

  async function togglePublish(a: Announcement) {
    const published_at = a.published_at ? null : new Date().toISOString();
    await fetch("/api/admin/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, published_at }),
    });
    loadAnnouncements();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    loadAnnouncements();
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">
            Post updates for players and teams
          </p>
        </div>
        <Button
          color="primary"
          onPress={openCreate}
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          New Announcement
        </Button>
      </div>

      <TournamentSelector
        tournaments={tournaments}
        selectedId={selectedTournamentId}
        onChange={setSelectedTournamentId}
      />

      {loading ? (
        <RowSkeleton count={3} height="h-24" />
      ) : announcements.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl bg-brand-surface border border-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{a.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${a.published_at ? "bg-emerald-400/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"}`}
                    >
                      {a.published_at ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-600 capitalize">
                      {a.audience}
                    </span>
                  </div>
                  {a.body && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {a.body}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => togglePublish(a)}
                    title={a.published_at ? "Unpublish" : "Publish"}
                  >
                    {a.published_at ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => openEdit(a)}
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="danger"
                    onPress={() => handleDelete(a.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Edit Announcement" : "New Announcement"}
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
                label="Title"
                labelPlacement="outside"
                variant="bordered"
                isRequired
                value={form.title}
                onValueChange={(val) => setForm({ ...form, title: val })}
                placeholder="Schedule Update"
              />
              <Textarea
                label="Body"
                labelPlacement="outside"
                variant="bordered"
                minRows={4}
                value={form.body}
                onValueChange={(val) => setForm({ ...form, body: val })}
                placeholder="Details of the announcement…"
              />
              <div>
                <label className={labelCls}>Audience</label>
                <Select
                  aria-label="Audience"
                  variant="bordered"
                  selectedKeys={[form.audience]}
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      audience: Array.from(keys)[0] as AnnouncementAudience,
                    })
                  }
                  classNames={{
                    trigger:
                      "flex items-center bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8 h-[42px]",
                    value: "text-white text-sm",
                    popoverContent: "bg-brand-charcoal border border-white/10",
                    listbox: "text-white",
                    selectorIcon: "text-gray-400 shrink-0",
                  }}
                >
                  <SelectItem key="all">Everyone</SelectItem>
                  <SelectItem key="players">Players Only</SelectItem>
                  <SelectItem key="coaches">Coaches Only</SelectItem>
                  <SelectItem key="admins">Admins Only</SelectItem>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="bordered" onPress={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" isLoading={saving}>
                  {saving
                    ? "Saving…"
                    : editingId
                      ? "Update"
                      : "Post Announcement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

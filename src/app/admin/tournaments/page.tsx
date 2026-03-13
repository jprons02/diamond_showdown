"use client";

import { useEffect, useState, useCallback } from "react";
import type { Tournament, TournamentStatus } from "@/lib/types/database";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/react";
import {
  parseDate,
  parseDateTime,
  type CalendarDate,
  type CalendarDateTime,
} from "@internationalized/date";

const STATUS_OPTIONS: TournamentStatus[] = [
  "draft",
  "open",
  "closed",
  "completed",
  "cancelled",
];
const STATUS_COLORS: Record<TournamentStatus, string> = {
  draft: "bg-gray-500/10 text-gray-400",
  open: "bg-emerald-400/10 text-emerald-400",
  closed: "bg-amber-400/10 text-amber-400",
  completed: "bg-brand-teal/10 text-brand-teal",
  cancelled: "bg-red-400/10 text-red-400",
};

interface TournamentFormData {
  name: string;
  slug: string;
  event_date: string;
  location_name: string;
  location_address: string;
  registration_open: string;
  registration_close: string;
  draft_datetime: string;
  min_players: string;
  max_players: string;
  entry_fee: string;
  status: TournamentStatus;
  rules_text: string;
}

const EMPTY_FORM: TournamentFormData = {
  name: "",
  slug: "",
  event_date: "",
  location_name: "",
  location_address: "",
  registration_open: "",
  registration_close: "",
  draft_datetime: "",
  min_players: "",
  max_players: "",
  entry_fee: "",
  status: "draft",
  rules_text: "",
};

function toCalendarDate(str: string): CalendarDate | null {
  if (!str) return null;
  try {
    return parseDate(str);
  } catch {
    return null;
  }
}

function toCalendarDateTime(str: string): CalendarDateTime | null {
  if (!str) return null;
  try {
    return parseDateTime(str.length === 16 ? str + ":00" : str);
  } catch {
    return null;
  }
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TournamentFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof TournamentFormData, string>>
  >({});

  const loadTournaments = useCallback(async () => {
    const res = await fetch("/api/admin/tournaments");
    const data = await res.json();
    setTournaments(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  function slugify(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowForm(true);
  }

  function openEditForm(t: Tournament) {
    setEditingId(t.id);
    setFormErrors({});
    setForm({
      name: t.name,
      slug: t.slug,
      event_date: t.event_date ?? "",
      location_name: t.location_name ?? "",
      location_address: t.location_address ?? "",
      registration_open: t.registration_open?.slice(0, 16) ?? "",
      registration_close: t.registration_close?.slice(0, 16) ?? "",
      draft_datetime: t.draft_datetime?.slice(0, 16) ?? "",
      min_players: t.min_players?.toString() ?? "",
      max_players: t.max_players?.toString() ?? "",
      entry_fee: t.entry_fee?.toString() ?? "",
      status: t.status,
      rules_text: t.rules_text ?? "",
    });
    setShowForm(true);
  }

  function validateForm(
    data: TournamentFormData,
  ): Partial<Record<keyof TournamentFormData, string>> {
    const errors: Partial<Record<keyof TournamentFormData, string>> = {};
    const {
      registration_open,
      registration_close,
      draft_datetime,
      event_date,
    } = data;

    if (
      registration_open &&
      registration_close &&
      registration_close < registration_open
    ) {
      errors.registration_close =
        "Registration close must be after registration open.";
    }
    if (
      registration_close &&
      draft_datetime &&
      draft_datetime.slice(0, 10) < registration_close
    ) {
      errors.draft_datetime = "Draft date cannot be before registration close.";
    }
    if (
      draft_datetime &&
      event_date &&
      event_date < draft_datetime.slice(0, 10)
    ) {
      errors.draft_datetime =
        (errors.draft_datetime ? errors.draft_datetime + " " : "") +
        "Draft date cannot be after event date.";
    }
    if (registration_open && event_date && event_date < registration_open) {
      errors.event_date = "Event date must be after registration opens.";
    }
    if (registration_close && event_date && event_date < registration_close) {
      errors.event_date = "Event date must be after registration closes.";
    }

    return errors;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      event_date: form.event_date || null,
      location_name: form.location_name || null,
      location_address: form.location_address || null,
      registration_open: form.registration_open || null,
      registration_close: form.registration_close || null,
      draft_datetime: form.draft_datetime || null,
      min_players: form.min_players ? parseInt(form.min_players) : null,
      max_players: form.max_players ? parseInt(form.max_players) : null,
      entry_fee: form.entry_fee ? parseFloat(form.entry_fee) : null,
      status: form.status,
      rules_text: form.rules_text || null,
    };

    if (editingId) {
      await fetch("/api/admin/tournaments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    setShowForm(false);
    loadTournaments();
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this tournament? This cannot be undone.",
      )
    )
      return;
    await fetch(`/api/admin/tournaments?id=${id}`, { method: "DELETE" });
    loadTournaments();
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournaments</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage tournament events
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          New Tournament
        </button>
      </div>

      {/* Tournament list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
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
                  {t.location_name ? ` • ${t.location_name}` : ""}
                  {t.max_players ? ` • ${t.max_players} max players` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditForm(t)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  title="Edit"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Edit Tournament" : "New Tournament"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tournament Name *</label>
                  <input
                    required
                    className={inputCls}
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug: form.slug || slugify(e.target.value),
                      })
                    }
                    placeholder="Spring Classic 2026"
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input
                    className={inputCls}
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="spring-classic-2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    label="Event Date"
                    labelPlacement="outside"
                    granularity="day"
                    variant="bordered"
                    isInvalid={!!formErrors.event_date}
                    errorMessage={formErrors.event_date}
                    value={toCalendarDate(form.event_date)}
                    onChange={(val) => {
                      const updated = {
                        ...form,
                        event_date: val ? val.toString() : "",
                      };
                      setForm(updated);
                      setFormErrors(validateForm(updated));
                    }}
                    classNames={{
                      base: "w-full",
                      label: "text-xs font-medium !text-gray-400",
                      inputWrapper:
                        "bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8",
                      segment:
                        "text-white data-[placeholder=true]:text-gray-500",
                      selectorIcon: "text-gray-400",
                    }}
                  />
                </div>
                <div>
                  <Select
                    label="Status"
                    labelPlacement="outside"
                    variant="bordered"
                    selectedKeys={[form.status]}
                    onSelectionChange={(keys) =>
                      setForm({
                        ...form,
                        status: Array.from(keys)[0] as TournamentStatus,
                      })
                    }
                    classNames={{
                      base: "w-full",
                      label: "text-xs font-medium !text-gray-400",
                      trigger:
                        "bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8 h-[42px]",
                      value: "text-white text-sm",
                      popoverContent:
                        "bg-brand-charcoal border border-white/10",
                      listbox: "text-white",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Location Name</label>
                  <input
                    className={inputCls}
                    value={form.location_name}
                    onChange={(e) =>
                      setForm({ ...form, location_name: e.target.value })
                    }
                    placeholder="City Park Fields"
                  />
                </div>
                <div>
                  <label className={labelCls}>Location Address</label>
                  <input
                    className={inputCls}
                    value={form.location_address}
                    onChange={(e) =>
                      setForm({ ...form, location_address: e.target.value })
                    }
                    placeholder="123 Main St, City, ST"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    label="Registration Opens"
                    labelPlacement="outside"
                    granularity="day"
                    variant="bordered"
                    value={toCalendarDate(form.registration_open)}
                    onChange={(val) => {
                      const updated = {
                        ...form,
                        registration_open: val ? val.toString() : "",
                      };
                      setForm(updated);
                      setFormErrors(validateForm(updated));
                    }}
                    classNames={{
                      base: "w-full",
                      label: "text-xs font-medium !text-gray-400",
                      inputWrapper:
                        "bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8",
                      segment:
                        "text-white data-[placeholder=true]:text-gray-500",
                      selectorIcon: "text-gray-400",
                    }}
                  />
                </div>
                <div>
                  <DatePicker
                    label="Registration Closes"
                    labelPlacement="outside"
                    granularity="day"
                    variant="bordered"
                    isInvalid={!!formErrors.registration_close}
                    errorMessage={formErrors.registration_close}
                    value={toCalendarDate(form.registration_close)}
                    onChange={(val) => {
                      const updated = {
                        ...form,
                        registration_close: val ? val.toString() : "",
                      };
                      setForm(updated);
                      setFormErrors(validateForm(updated));
                    }}
                    classNames={{
                      base: "w-full",
                      label: "text-xs font-medium !text-gray-400",
                      inputWrapper:
                        "bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8",
                      segment:
                        "text-white data-[placeholder=true]:text-gray-500",
                      selectorIcon: "text-gray-400",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    label="Draft Date"
                    labelPlacement="outside"
                    granularity="day"
                    variant="bordered"
                    isInvalid={!!formErrors.draft_datetime}
                    errorMessage={formErrors.draft_datetime}
                    value={toCalendarDate(form.draft_datetime)}
                    onChange={(val) => {
                      const updated = {
                        ...form,
                        draft_datetime: val ? val.toString() : "",
                      };
                      setForm(updated);
                      setFormErrors(validateForm(updated));
                    }}
                    classNames={{
                      base: "w-full",
                      label: "text-xs font-medium !text-gray-400",
                      inputWrapper:
                        "bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8",
                      segment:
                        "text-white data-[placeholder=true]:text-gray-500",
                      selectorIcon: "text-gray-400",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Min Players</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.min_players}
                    onChange={(e) =>
                      setForm({ ...form, min_players: e.target.value })
                    }
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className={labelCls}>Max Players</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.max_players}
                    onChange={(e) =>
                      setForm({ ...form, max_players: e.target.value })
                    }
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className={labelCls}>Entry Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputCls}
                    value={form.entry_fee}
                    onChange={(e) =>
                      setForm({ ...form, entry_fee: e.target.value })
                    }
                    placeholder="50.00"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Rules / Notes</label>
                <textarea
                  rows={4}
                  className={inputCls}
                  value={form.rules_text}
                  onChange={(e) =>
                    setForm({ ...form, rules_text: e.target.value })
                  }
                  placeholder="Optional rules or notes for this tournament..."
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
                  {saving
                    ? "Saving…"
                    : editingId
                      ? "Update Tournament"
                      : "Create Tournament"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

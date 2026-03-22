"use client";

import { useState } from "react";
import type {
  Tournament,
  TournamentStatus,
  BracketFormat,
} from "@/lib/types/database";
import { DatePicker } from "@heroui/date-picker";
import { Select, SelectItem, Input, Textarea, Button } from "@heroui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseDate, type CalendarDate } from "@internationalized/date";

const BRACKET_FORMAT_OPTIONS: { value: BracketFormat; label: string }[] = [
  { value: "single_elimination", label: "Single Elimination" },
  { value: "double_elimination", label: "Double Elimination" },
  { value: "pool_to_bracket", label: "Pool Play → Bracket" },
  { value: "custom", label: "Custom" },
];

const STATUS_OPTIONS: TournamentStatus[] = [
  "draft",
  "open",
  "closed",
  "completed",
  "cancelled",
];

interface TournamentFormData {
  name: string;
  slug: string;
  event_date: string;
  event_end_date: string;
  location_name: string;
  location_address: string;
  registration_open: string;
  registration_close: string;
  draft_datetime: string;
  min_players: string;
  max_players: string;
  entry_fee: string;
  status: TournamentStatus;
  bracket_format: BracketFormat | "";
  rules_text: string;
}

const EMPTY_FORM: TournamentFormData = {
  name: "",
  slug: "",
  event_date: "",
  event_end_date: "",
  location_name: "",
  location_address: "",
  registration_open: "",
  registration_close: "",
  draft_datetime: "",
  min_players: "",
  max_players: "",
  entry_fee: "",
  status: "draft",
  bracket_format: "",
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

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
    event_end_date,
  } = data;

  if (event_end_date && event_date && event_end_date < event_date) {
    errors.event_end_date = "End date must be on or after the start date.";
  }

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

function tournamentToForm(t: Tournament): TournamentFormData {
  return {
    name: t.name,
    slug: t.slug,
    event_date: t.event_date ?? "",
    event_end_date: t.event_end_date ?? "",
    location_name: t.location_name ?? "",
    location_address: t.location_address ?? "",
    registration_open: t.registration_open?.slice(0, 16) ?? "",
    registration_close: t.registration_close?.slice(0, 16) ?? "",
    draft_datetime: t.draft_datetime?.slice(0, 16) ?? "",
    min_players: t.min_players?.toString() ?? "",
    max_players: t.max_players?.toString() ?? "",
    entry_fee: t.entry_fee?.toString() ?? "",
    status: t.status,
    bracket_format: t.bracket_format ?? "",
    rules_text: t.rules_text ?? "",
  };
}

interface TournamentFormDialogProps {
  /** Pass a tournament to edit it, or omit/null to create a new one */
  tournament?: Tournament | null;
  onClose: () => void;
  onSaved: () => void;
}

export function TournamentFormDialog({
  tournament,
  onClose,
  onSaved,
}: TournamentFormDialogProps) {
  const isEditing = !!tournament;
  const [form, setForm] = useState<TournamentFormData>(
    tournament ? tournamentToForm(tournament) : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof TournamentFormData, string>>
  >({});

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
      event_end_date: form.event_end_date || null,
      location_name: form.location_name || null,
      location_address: form.location_address || null,
      registration_open: form.registration_open || null,
      registration_close: form.registration_close || null,
      draft_datetime: form.draft_datetime || null,
      min_players: form.min_players ? parseInt(form.min_players) : null,
      max_players: form.max_players ? parseInt(form.max_players) : null,
      entry_fee: form.entry_fee ? parseFloat(form.entry_fee) : null,
      status: form.status,
      bracket_format: form.bracket_format || null,
      rules_text: form.rules_text || null,
    };

    if (isEditing) {
      await fetch("/api/admin/tournaments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tournament.id, ...payload }),
      });
    } else {
      await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Tournament" : "New Tournament"}
          </h2>
          <Button isIconOnly variant="light" onPress={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tournament Name"
              variant="bordered"
              isRequired
              value={form.name}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  name: val,
                  slug: isEditing ? form.slug : slugify(val),
                })
              }
              placeholder="Spring Classic 2026"
            />
            <Input
              label="URL Slug"
              variant="bordered"
              isReadOnly
              value={isEditing ? form.slug : slugify(form.name)}
              description="Auto-generated from the tournament name"
              classNames={{
                input: "text-gray-400",
                description: "text-gray-600 text-xs",
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DatePicker
                label="Event Start Date"
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
              />
            </div>
            <div>
              <DatePicker
                label="Event End Date"
                granularity="day"
                variant="bordered"
                isInvalid={!!formErrors.event_end_date}
                errorMessage={formErrors.event_end_date}
                value={toCalendarDate(form.event_end_date)}
                onChange={(val) => {
                  const updated = {
                    ...form,
                    event_end_date: val ? val.toString() : "",
                  };
                  setForm(updated);
                  setFormErrors(validateForm(updated));
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                label="Status"
                variant="bordered"
                selectedKeys={[form.status]}
                onSelectionChange={(keys) =>
                  setForm({
                    ...form,
                    status: Array.from(keys)[0] as TournamentStatus,
                  })
                }
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
            <Input
              label="Location Name"
              variant="bordered"
              value={form.location_name}
              onValueChange={(val) => setForm({ ...form, location_name: val })}
              placeholder="City Park Fields"
            />
            <Input
              label="Location Address"
              variant="bordered"
              value={form.location_address}
              onValueChange={(val) =>
                setForm({ ...form, location_address: val })
              }
              placeholder="123 Main St, City, ST"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DatePicker
                label="Registration Opens"
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
              />
            </div>
            <div>
              <DatePicker
                label="Registration Closes"
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
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DatePicker
                label="Draft Date"
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
              />
            </div>
            <div>
              <Select
                label="Bracket Format"
                variant="bordered"
                placeholder="Select format"
                selectedKeys={form.bracket_format ? [form.bracket_format] : []}
                onSelectionChange={(keys) =>
                  setForm({
                    ...form,
                    bracket_format:
                      (Array.from(keys)[0] as BracketFormat) ?? "",
                  })
                }
              >
                {BRACKET_FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value}>{opt.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Min Players"
              variant="bordered"
              type="number"
              value={form.min_players}
              onValueChange={(val) => setForm({ ...form, min_players: val })}
              placeholder="70"
            />
            <Input
              label="Max Players"
              variant="bordered"
              type="number"
              value={form.max_players}
              onValueChange={(val) => setForm({ ...form, max_players: val })}
              placeholder="100"
            />
            <Input
              label="Entry Fee ($)"
              variant="bordered"
              type="number"
              value={form.entry_fee}
              onValueChange={(val) => setForm({ ...form, entry_fee: val })}
              placeholder="50.00"
            />
          </div>

          <Textarea
            label="Rules / Notes"
            variant="bordered"
            minRows={4}
            value={form.rules_text}
            onValueChange={(val) => setForm({ ...form, rules_text: val })}
            placeholder="Optional rules or notes for this tournament..."
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="bordered" onPress={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary" isLoading={saving}>
              {saving
                ? "Saving…"
                : isEditing
                  ? "Update Tournament"
                  : "Create Tournament"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

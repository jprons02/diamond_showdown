"use client";

import { useEffect, useState, useCallback } from "react";
import { Button, Input, Switch, Select, SelectItem } from "@heroui/react";
import {
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CheckIcon,
  ArrowPathIcon,
  TrophyIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type {
  Tournament,
  TournamentStatus,
  Field,
  RegistrationWithPlayer,
  RegistrationWithJoins,
  RegistrationStatus,
  PaymentStatus,
  Team,
  TeamWithPlayers,
  TeamPlayer,
  Game,
  GameWithJoins,
  GameType,
  GameStatus,
  CheckInStatus,
} from "@/lib/types/database";

/* ─── Shared Dialog Shell ──────────────────────────────────── */

interface DialogShellProps {
  title: string;
  onClose: () => void;
  /** Optional link to the full admin page */
  fullPageHref?: string;
  wide?: boolean;
  children: React.ReactNode;
}

export function DialogShell({
  title,
  onClose,
  fullPageHref,
  wide,
  children,
}: DialogShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`relative bg-brand-surface border border-white/10 rounded-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[85vh] overflow-y-auto p-6`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            {fullPageHref && (
              <Link
                href={fullPageHref}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-teal transition-colors"
              >
                Full page
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              </Link>
            )}
            <Button isIconOnly variant="light" onPress={onClose}>
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. CREATE FIELDS
   ═══════════════════════════════════════════════════════════════ */

export function FieldsDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", sort_order: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
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
    onDataChange();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this field?")) return;
    await fetch(`/api/admin/fields?id=${id}`, { method: "DELETE" });
    load();
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

/* ═══════════════════════════════════════════════════════════════
   2. CHANGE TOURNAMENT STATUS (Open, Close, Complete)
   ═══════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════
   3. MANAGE REGISTRATIONS (summary view + quick actions)
   ═══════════════════════════════════════════════════════════════ */

export function RegistrationsDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [regs, setRegs] = useState<RegistrationWithJoins[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/admin/registrations?tournament_id=${tournamentId}`,
    );
    const data = await res.json();
    setRegs(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateField(
    id: string,
    field: string,
    value: string | boolean,
  ) {
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
    load();
    onDataChange();
  }

  const filtered = regs.filter((r) => {
    if (!search) return true;
    const p = r.player;
    return `${p?.first_name} ${p?.last_name} ${p?.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const paidCount = regs.filter((r) => r.payment_status === "paid").length;
  const eligibleCount = regs.filter((r) => r.draft_eligible).length;

  const REG_STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-400/10 text-amber-400",
    confirmed: "bg-emerald-400/10 text-emerald-400",
    waitlisted: "bg-purple-400/10 text-purple-400",
    cancelled: "bg-red-400/10 text-red-400",
    refunded: "bg-gray-500/10 text-gray-400",
    checked_in: "bg-brand-teal/10 text-brand-teal",
    no_show: "bg-red-400/10 text-red-400",
  };

  const PAY_STATUS_COLORS: Record<string, string> = {
    unpaid: "bg-red-400/10 text-red-400",
    pending: "bg-amber-400/10 text-amber-400",
    paid: "bg-emerald-400/10 text-emerald-400",
    refunded: "bg-gray-500/10 text-gray-400",
  };

  return (
    <DialogShell
      title="Manage Registrations"
      onClose={onClose}
      fullPageHref="/admin/registrations"
      wide
    >
      <div className="space-y-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            <strong className="text-white">{regs.length}</strong> registered
          </span>
          <span>
            <strong className="text-emerald-400">{paidCount}</strong> paid
          </span>
          <span>
            <strong className="text-brand-teal">{eligibleCount}</strong>{" "}
            draft-eligible
          </span>
        </div>

        <Input
          size="sm"
          variant="bordered"
          placeholder="Search by name or email..."
          value={search}
          onValueChange={setSearch}
          startContent={
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
          }
        />

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No registrations found.</p>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {filtered.map((reg) => {
              const player = reg.player;
              return (
                <div
                  key={reg.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">
                      {player?.first_name} {player?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {player?.email}
                    </p>
                  </div>
                  <select
                    value={reg.registration_status}
                    onChange={(e) =>
                      updateField(reg.id, "registration_status", e.target.value)
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer shrink-0 ${REG_STATUS_COLORS[reg.registration_status] ?? ""}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="waitlisted">Waitlisted</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={reg.payment_status}
                    onChange={(e) =>
                      updateField(reg.id, "payment_status", e.target.value)
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer shrink-0 ${PAY_STATUS_COLORS[reg.payment_status] ?? ""}`}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <Button
                    size="sm"
                    variant={reg.draft_eligible ? "flat" : "bordered"}
                    color={reg.draft_eligible ? "success" : "default"}
                    className="shrink-0 text-xs"
                    onPress={() =>
                      updateField(reg.id, "draft_eligible", !reg.draft_eligible)
                    }
                  >
                    {reg.draft_eligible ? "Eligible" : "Not Eligible"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DialogShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. CREATE TEAMS
   ═══════════════════════════════════════════════════════════════ */

export function TeamsDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [teams, setTeams] = useState<TeamWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    seed: "",
    color: "",
    coach_name: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/admin/teams?tournament_id=${tournamentId}&include_players=true`,
    );
    const data = await res.json();
    setTeams(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm({
      name: "",
      seed: String(teams.length + 1),
      color: "",
      coach_name: "",
    });
    setShowForm(true);
  }

  function openEdit(t: TeamWithPlayers) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      seed: t.seed?.toString() ?? "",
      color: t.color ?? "",
      coach_name: t.coach_name ?? "",
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      tournament_id: tournamentId,
      name: form.name,
      seed: form.seed ? parseInt(form.seed) : null,
      color: form.color || null,
      coach_name: form.coach_name || null,
    };
    if (editingId) {
      await fetch("/api/admin/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    load();
    onDataChange();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team?")) return;
    await fetch(`/api/admin/teams?id=${id}`, { method: "DELETE" });
    load();
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
              <Input
                size="sm"
                type="color"
                label="Color"
                variant="bordered"
                value={form.color || "#0ED3CF"}
                onValueChange={(v) => setForm({ ...form, color: v })}
              />
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

/* ═══════════════════════════════════════════════════════════════
   5. DRAFT (assign players to teams)
   ═══════════════════════════════════════════════════════════════ */

export function DraftDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [teams, setTeams] = useState<TeamWithPlayers[]>([]);
  const [unassigned, setUnassigned] = useState<RegistrationWithJoins[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [teamsRes, regsRes] = await Promise.all([
      fetch(
        `/api/admin/teams?tournament_id=${tournamentId}&include_players=true`,
      ),
      fetch(`/api/admin/registrations?tournament_id=${tournamentId}`),
    ]);
    const teamsData = await teamsRes.json();
    const regsData = await regsRes.json();

    const allTeams: TeamWithPlayers[] = Array.isArray(teamsData)
      ? teamsData
      : [];
    const allRegs: RegistrationWithJoins[] = Array.isArray(regsData)
      ? regsData
      : [];

    // Find registrations that are draft-eligible but not on any team
    const assignedRegIds = new Set(
      allTeams.flatMap((t) =>
        (t.team_players ?? []).map((tp) => tp.registration_id),
      ),
    );
    const eligible = allRegs.filter(
      (r) => r.draft_eligible && !assignedRegIds.has(r.id),
    );

    setTeams(allTeams);
    setUnassigned(eligible);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function assignToTeam(registrationId: string, teamId: string) {
    setAssigning(registrationId);
    // Count current picks to auto-set draft pick number
    const team = teams.find((t) => t.id === teamId);
    const pickNumber = (team?.team_players?.length ?? 0) + 1;

    await fetch("/api/admin/team-players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournament_id: tournamentId,
        team_id: teamId,
        registration_id: registrationId,
        draft_pick_number: pickNumber,
      }),
    });
    setAssigning(null);
    load();
    onDataChange();
  }

  return (
    <DialogShell
      title="Draft — Assign Players"
      onClose={onClose}
      fullPageHref="/admin/teams"
      wide
    >
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Unassigned pool */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Unassigned Draft-Eligible Players ({unassigned.length})
              </p>
              {unassigned.length === 0 ? (
                <p className="text-sm text-gray-500">
                  All eligible players have been assigned to teams.
                </p>
              ) : (
                <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                  {unassigned.map((reg) => {
                    const player = reg.player;
                    return (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-white font-medium truncate">
                            {player?.first_name} {player?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {player?.email}
                          </p>
                        </div>
                        <Select
                          aria-label="Assign to team"
                          variant="bordered"
                          size="sm"
                          placeholder="Assign to..."
                          className="w-40 shrink-0"
                          isDisabled={assigning === reg.id}
                          onSelectionChange={(keys) => {
                            const teamId = Array.from(keys)[0] as string;
                            if (teamId) assignToTeam(reg.id, teamId);
                          }}
                          classNames={{
                            trigger:
                              "bg-white/5 border-white/10 rounded-xl h-[34px]",
                            value: "text-white text-xs",
                            popoverContent:
                              "bg-brand-charcoal border border-white/10",
                            listbox: "text-white",
                          }}
                        >
                          {teams.map((t) => (
                            <SelectItem key={t.id}>{t.name}</SelectItem>
                          ))}
                        </Select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Team summary */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Team Rosters
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {team.color && (
                        <div
                          className="w-2.5 h-2.5 rounded-full border border-white/10"
                          style={{ backgroundColor: team.color }}
                        />
                      )}
                      <p className="text-sm text-white font-medium">
                        {team.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {team.team_players?.length ?? 0} players
                      </span>
                    </div>
                    {(team.team_players ?? []).length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        {(team.team_players ?? []).map((tp) => (
                          <p key={tp.id}>
                            #{tp.draft_pick_number ?? "—"}{" "}
                            {tp.registration?.player?.first_name}{" "}
                            {tp.registration?.player?.last_name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DialogShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. SCHEDULE GAMES
   ═══════════════════════════════════════════════════════════════ */

export function ScheduleGamesDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [games, setGames] = useState<GameWithJoins[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    game_type: "pool" as GameType,
    round_name: "",
    game_number: "",
    field_id: "",
    home_team_id: "",
    away_team_id: "",
    start_time: "",
  });

  const load = useCallback(async () => {
    const [gamesRes, teamsRes, fieldsRes] = await Promise.all([
      fetch(`/api/admin/games?tournament_id=${tournamentId}`),
      fetch(`/api/admin/teams?tournament_id=${tournamentId}`),
      fetch(`/api/admin/fields?tournament_id=${tournamentId}`),
    ]);
    setGames(
      Array.isArray(await gamesRes.clone().json()) ? await gamesRes.json() : [],
    );
    setTeams(
      Array.isArray(await teamsRes.clone().json()) ? await teamsRes.json() : [],
    );
    setFields(
      Array.isArray(await fieldsRes.clone().json())
        ? await fieldsRes.json()
        : [],
    );
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournament_id: tournamentId,
        game_type: form.game_type,
        round_name: form.round_name || null,
        game_number: form.game_number ? parseInt(form.game_number) : null,
        field_id: form.field_id || null,
        home_team_id: form.home_team_id || null,
        away_team_id: form.away_team_id || null,
        start_time: form.start_time || null,
        status: "scheduled",
      }),
    });
    setSaving(false);
    setForm({
      game_type: "pool",
      round_name: form.round_name,
      game_number: form.game_number
        ? String(parseInt(form.game_number) + 1)
        : "",
      field_id: "",
      home_team_id: "",
      away_team_id: "",
      start_time: "",
    });
    load();
    onDataChange();
  }

  const poolGames = games.filter((g) => g.game_type === "pool");

  return (
    <DialogShell
      title="Schedule Games"
      onClose={onClose}
      fullPageHref="/admin/games"
      wide
    >
      <div className="space-y-4">
        {/* Summary of existing games */}
        <p className="text-xs text-gray-500">
          {poolGames.length} pool game{poolGames.length !== 1 ? "s" : ""}{" "}
          scheduled
        </p>

        {/* Quick create form */}
        <form
          onSubmit={handleCreate}
          className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5"
        >
          <p className="text-sm font-medium text-white">Add Game</p>
          <div className="grid grid-cols-2 gap-3">
            <Select
              size="sm"
              label="Type"
              variant="bordered"
              selectedKeys={[form.game_type]}
              onSelectionChange={(keys) =>
                setForm({ ...form, game_type: Array.from(keys)[0] as GameType })
              }
            >
              <SelectItem key="pool">Pool</SelectItem>
              <SelectItem key="bracket">Bracket</SelectItem>
              <SelectItem key="championship">Championship</SelectItem>
              <SelectItem key="consolation">Consolation</SelectItem>
            </Select>
            <Input
              size="sm"
              label="Game #"
              variant="bordered"
              type="number"
              value={form.game_number}
              onValueChange={(v) => setForm({ ...form, game_number: v })}
            />
          </div>
          <Input
            size="sm"
            label="Round Name"
            variant="bordered"
            value={form.round_name}
            onValueChange={(v) => setForm({ ...form, round_name: v })}
            placeholder="Pool Round 1"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              size="sm"
              label="Home Team"
              variant="bordered"
              selectedKeys={form.home_team_id ? [form.home_team_id] : []}
              onSelectionChange={(keys) =>
                setForm({
                  ...form,
                  home_team_id: (Array.from(keys)[0] as string) ?? "",
                })
              }
            >
              {teams.map((t) => (
                <SelectItem key={t.id}>{t.name}</SelectItem>
              ))}
            </Select>
            <Select
              size="sm"
              label="Away Team"
              variant="bordered"
              selectedKeys={form.away_team_id ? [form.away_team_id] : []}
              onSelectionChange={(keys) =>
                setForm({
                  ...form,
                  away_team_id: (Array.from(keys)[0] as string) ?? "",
                })
              }
            >
              {teams.map((t) => (
                <SelectItem key={t.id}>{t.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              size="sm"
              label="Field"
              variant="bordered"
              selectedKeys={form.field_id ? [form.field_id] : []}
              onSelectionChange={(keys) =>
                setForm({
                  ...form,
                  field_id: (Array.from(keys)[0] as string) ?? "",
                })
              }
            >
              {fields.map((f) => (
                <SelectItem key={f.id}>{f.name}</SelectItem>
              ))}
            </Select>
            <Input
              size="sm"
              label="Start Time"
              variant="bordered"
              type="datetime-local"
              value={form.start_time}
              onValueChange={(v) => setForm({ ...form, start_time: v })}
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" type="submit" color="primary" isLoading={saving}>
              Schedule Game
            </Button>
          </div>
        </form>

        {/* Existing games list */}
        {!loading && games.length > 0 && (
          <div className="space-y-2 max-h-[30vh] overflow-y-auto">
            {games.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {g.game_number && (
                      <span className="text-xs text-gray-500">
                        #{g.game_number}
                      </span>
                    )}
                    <span className="text-xs text-gray-600">{g.game_type}</span>
                    {g.round_name && (
                      <span className="text-xs text-gray-600">
                        · {g.round_name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white mt-0.5">
                    {g.home_team?.name ?? "TBD"} vs {g.away_team?.name ?? "TBD"}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    g.status === "final"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : g.status === "in_progress"
                        ? "bg-amber-400/10 text-amber-400"
                        : "bg-white/5 text-gray-400"
                  }`}
                >
                  {g.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DialogShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. CHECK-IN
   ═══════════════════════════════════════════════════════════════ */

export function CheckInDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [regs, setRegs] = useState<RegistrationWithPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/admin/registrations?tournament_id=${tournamentId}`,
    );
    const data = await res.json();
    const all: RegistrationWithPlayer[] = Array.isArray(data) ? data : [];
    setRegs(
      all.filter((r) =>
        ["confirmed", "checked_in", "no_show"].includes(r.registration_status),
      ),
    );
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function setCheckIn(regId: string, status: CheckInStatus) {
    setActionId(regId);
    const updates: Record<string, unknown> = { check_in_status: status };
    if (status === "checked_in") updates.registration_status = "checked_in";
    else if (status === "no_show") updates.registration_status = "no_show";
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: regId, ...updates }),
    });
    setActionId(null);
    load();
    onDataChange();
  }

  const filtered = regs.filter((r) => {
    if (!search) return true;
    const p = r.player;
    return `${p?.first_name} ${p?.last_name} ${p?.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const checkedIn = regs.filter(
    (r) => r.check_in_status === "checked_in",
  ).length;

  return (
    <DialogShell
      title="Player Check-In"
      onClose={onClose}
      fullPageHref="/admin/check-in"
      wide
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
            <span className="text-lg font-bold text-emerald-400">
              {checkedIn}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ {regs.length}</span>
          </div>
          <Input
            size="sm"
            variant="bordered"
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
            startContent={
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
            }
            className="flex-1"
          />
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500">
            No confirmed registrations to check in.
          </p>
        ) : (
          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {filtered.map((reg) => {
              const player = reg.player;
              const status = reg.check_in_status ?? "not_arrived";
              return (
                <div
                  key={reg.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    status === "checked_in"
                      ? "bg-emerald-400/10 border-emerald-400/20"
                      : status === "no_show"
                        ? "bg-red-400/10 border-red-400/20"
                        : "bg-white/[0.02] border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status === "checked_in" ? (
                      <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : status === "no_show" ? (
                      <XCircleIcon className="w-5 h-5 text-red-400 shrink-0" />
                    ) : (
                      <ClockIcon className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-white font-medium">
                        {player?.first_name} {player?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{player?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {status !== "checked_in" && (
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        isLoading={actionId === reg.id}
                        onPress={() => setCheckIn(reg.id, "checked_in")}
                      >
                        Check In
                      </Button>
                    )}
                    {status === "checked_in" && (
                      <Button
                        size="sm"
                        variant="light"
                        isLoading={actionId === reg.id}
                        onPress={() => setCheckIn(reg.id, "not_arrived")}
                      >
                        Undo
                      </Button>
                    )}
                    {status !== "no_show" && (
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isLoading={actionId === reg.id}
                        onPress={() => setCheckIn(reg.id, "no_show")}
                      >
                        No Show
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DialogShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. SCORE ENTRY (pool + bracket)
   ═══════════════════════════════════════════════════════════════ */

export function ScoresDialog({
  tournamentId,
  gameTypeFilter,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  /** "pool" or "bracket" — filters which games to show */
  gameTypeFilter: "pool" | "bracket";
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [games, setGames] = useState<GameWithJoins[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoringId, setScoringId] = useState<string | null>(null);
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/games?tournament_id=${tournamentId}`);
    const data = await res.json();
    const all: GameWithJoins[] = Array.isArray(data) ? data : [];
    if (gameTypeFilter === "pool") {
      setGames(all.filter((g) => g.game_type === "pool"));
    } else {
      setGames(
        all.filter(
          (g) =>
            g.game_type === "bracket" ||
            g.game_type === "championship" ||
            g.game_type === "consolation",
        ),
      );
    }
    setLoading(false);
  }, [tournamentId, gameTypeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function openScore(game: GameWithJoins) {
    setScoringId(game.id);
    setScoreHome(game.home_score?.toString() ?? "");
    setScoreAway(game.away_score?.toString() ?? "");
  }

  async function submitScore() {
    if (!scoringId) return;
    setSaving(true);
    await fetch("/api/admin/games/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_id: scoringId,
        home_score: parseInt(scoreHome),
        away_score: parseInt(scoreAway),
      }),
    });
    setSaving(false);
    setScoringId(null);
    load();
    onDataChange();
  }

  async function startGame(gameId: string) {
    setActionId(gameId);
    await fetch("/api/admin/games", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: gameId, status: "in_progress" }),
    });
    setActionId(null);
    load();
    onDataChange();
  }

  async function reopenGame(gameId: string) {
    setActionId(gameId);
    await fetch("/api/admin/games", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: gameId,
        status: "in_progress",
        winner_team_id: null,
        loser_team_id: null,
      }),
    });
    setActionId(null);
    load();
    onDataChange();
  }

  const finalCount = games.filter((g) => g.status === "final").length;
  const title =
    gameTypeFilter === "pool" ? "Pool Play Scores" : "Bracket Scores";

  return (
    <DialogShell
      title={title}
      onClose={onClose}
      fullPageHref="/admin/games"
      wide
    >
      <div className="space-y-4">
        <p className="text-xs text-gray-500">
          {finalCount} of {games.length} games completed
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : games.length === 0 ? (
          <p className="text-sm text-gray-500">
            No {gameTypeFilter === "pool" ? "pool" : "bracket"} games found.
          </p>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {games.map((game) => {
              const isScoring = scoringId === game.id;
              return (
                <div
                  key={game.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {game.game_number && (
                          <span className="text-xs text-gray-500">
                            #{game.game_number}
                          </span>
                        )}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            game.status === "final"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : game.status === "in_progress"
                                ? "bg-amber-400/10 text-amber-400"
                                : "bg-white/5 text-gray-400"
                          }`}
                        >
                          {game.status.replace("_", " ")}
                        </span>
                        {game.round_name && (
                          <span className="text-xs text-gray-600">
                            {game.round_name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-white">
                          {game.home_team?.name ?? "TBD"}
                        </span>
                        {game.status === "final" || game.home_score !== null ? (
                          <span className="text-sm font-bold text-white">
                            {game.home_score ?? 0} – {game.away_score ?? 0}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">vs</span>
                        )}
                        <span className="text-sm text-white">
                          {game.away_team?.name ?? "TBD"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {game.status === "scheduled" && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="warning"
                          isLoading={actionId === game.id}
                          onPress={() => startGame(game.id)}
                        >
                          Start
                        </Button>
                      )}
                      {(game.status === "in_progress" ||
                        game.status === "scheduled") && (
                        <Button
                          size="sm"
                          color="primary"
                          onPress={() => openScore(game)}
                        >
                          Score
                        </Button>
                      )}
                      {game.status === "final" && (
                        <Button
                          size="sm"
                          variant="light"
                          isLoading={actionId === game.id}
                          onPress={() => reopenGame(game.id)}
                          startContent={
                            actionId !== game.id ? (
                              <ArrowPathIcon className="w-3 h-3" />
                            ) : undefined
                          }
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Inline score entry */}
                  {isScoring && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-end gap-2">
                      <Input
                        size="sm"
                        label={game.home_team?.name ?? "Home"}
                        variant="bordered"
                        type="number"
                        min={0}
                        value={scoreHome}
                        onValueChange={setScoreHome}
                        autoFocus
                        className="flex-1"
                      />
                      <Input
                        size="sm"
                        label={game.away_team?.name ?? "Away"}
                        variant="bordered"
                        type="number"
                        min={0}
                        value={scoreAway}
                        onValueChange={setScoreAway}
                        className="flex-1"
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        color="primary"
                        isLoading={saving}
                        isDisabled={!scoreHome || !scoreAway}
                        onPress={submitScore}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="bordered"
                        onPress={() => setScoringId(null)}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DialogShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. GENERATE BRACKET
   ═══════════════════════════════════════════════════════════════ */

export function GenerateBracketDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const [games, setGames] = useState<GameWithJoins[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    seedings: Array<{
      team_name: string;
      seed: number;
      wins: number;
      losses: number;
      run_differential: number;
    }>;
  } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/games?tournament_id=${tournamentId}`);
    const data = await res.json();
    setGames(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  const poolGames = games.filter((g) => g.game_type === "pool");
  const pendingPool = poolGames.filter(
    (g) =>
      g.status !== "final" &&
      g.status !== "forfeit" &&
      g.status !== "cancelled",
  );
  const allPoolFinal = poolGames.length > 0 && pendingPool.length === 0;
  const bracketExists = games.some(
    (g) => g.game_type === "bracket" || g.game_type === "championship",
  );

  async function handleGenerate() {
    if (
      bracketExists &&
      !confirm("Re-generating will replace existing bracket games. Continue?")
    ) {
      return;
    }
    setGenerating(true);
    const res = await fetch("/api/admin/games/bracket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tournament_id: tournamentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    }
    setGenerating(false);
    load();
    onDataChange();
  }

  return (
    <DialogShell
      title="Generate Bracket"
      onClose={onClose}
      fullPageHref="/admin/games"
    >
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="text-sm text-gray-400">
              <p>
                {poolGames.length} pool game{poolGames.length !== 1 ? "s" : ""}{" "}
                found.{" "}
                {allPoolFinal
                  ? "All pool games are final — ready to generate bracket."
                  : `${pendingPool.length} game${pendingPool.length !== 1 ? "s" : ""} still need final scores.`}
              </p>
            </div>

            {!allPoolFinal && pendingPool.length > 0 && (
              <div className="space-y-1 text-xs text-gray-500">
                {pendingPool.slice(0, 5).map((g) => (
                  <p key={g.id}>
                    • {g.home_team?.name ?? "TBD"} vs{" "}
                    {g.away_team?.name ?? "TBD"} ({g.status.replace("_", " ")})
                  </p>
                ))}
                {pendingPool.length > 5 && (
                  <p>+{pendingPool.length - 5} more</p>
                )}
              </div>
            )}

            {bracketExists && (
              <p className="text-xs text-amber-400">
                Bracket games already exist. Generating again will replace them.
              </p>
            )}

            {result && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Seedings
                </p>
                {result.seedings.map((s) => (
                  <p key={s.seed} className="text-xs text-gray-400">
                    #{s.seed} {s.team_name} — {s.wins}W-{s.losses}L (diff:{" "}
                    {s.run_differential > 0 ? "+" : ""}
                    {s.run_differential})
                  </p>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="bordered" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={generating}
                isDisabled={!allPoolFinal}
                onPress={handleGenerate}
                startContent={
                  !generating ? <TrophyIcon className="w-4 h-4" /> : undefined
                }
              >
                {bracketExists ? "Re-generate Bracket" : "Generate Bracket"}
              </Button>
            </div>
          </>
        )}
      </div>
    </DialogShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. PUBLISH BRACKET (toggle)
   ═══════════════════════════════════════════════════════════════ */

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

"use client";

import { useEffect, useState, useCallback } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import type {
  TeamWithPlayers,
  RegistrationWithJoins,
} from "@/lib/types/database";
import { DialogShell } from "@/components/admin/DialogShell";

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

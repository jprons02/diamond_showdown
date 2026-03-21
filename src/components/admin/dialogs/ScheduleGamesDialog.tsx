"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { DatePicker } from "@heroui/date-picker";
import type { GameType } from "@/lib/types/database";
import { DialogShell } from "@/components/admin/DialogShell";
import { useGames } from "@/hooks/admin/useGames";
import { toCalendarDateTime } from "@/lib/utils/dateTime";

export function ScheduleGamesDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const {
    games,
    teams,
    fields,
    loading,
    newGame,
    setNewGame,
    gameSaving,
    handleCreateGame: baseCreate,
    poolGames,
  } = useGames(tournamentId);

  async function handleCreate(e: React.FormEvent) {
    await baseCreate(e);
    onDataChange();
  }

  return (
    <DialogShell
      title="Schedule Games"
      onClose={onClose}
      fullPageHref="/admin/games"
      wide
    >
      <div className="space-y-4">
        <p className="text-xs text-gray-500">
          {poolGames.length} pool game{poolGames.length !== 1 ? "s" : ""}{" "}
          scheduled
        </p>

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
              selectedKeys={[newGame.game_type]}
              onSelectionChange={(keys) =>
                setNewGame({
                  ...newGame,
                  game_type: Array.from(keys)[0] as GameType,
                })
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
              value={newGame.game_number}
              onValueChange={(v) => setNewGame({ ...newGame, game_number: v })}
            />
          </div>
          <Input
            size="sm"
            label="Round Name"
            variant="bordered"
            value={newGame.round_name}
            onValueChange={(v) => setNewGame({ ...newGame, round_name: v })}
            placeholder="Pool Round 1"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              size="sm"
              label="Home Team"
              variant="bordered"
              selectedKeys={newGame.home_team_id ? [newGame.home_team_id] : []}
              onSelectionChange={(keys) =>
                setNewGame({
                  ...newGame,
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
              selectedKeys={newGame.away_team_id ? [newGame.away_team_id] : []}
              onSelectionChange={(keys) =>
                setNewGame({
                  ...newGame,
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
              selectedKeys={newGame.field_id ? [newGame.field_id] : []}
              onSelectionChange={(keys) =>
                setNewGame({
                  ...newGame,
                  field_id: (Array.from(keys)[0] as string) ?? "",
                })
              }
            >
              {fields.map((f) => (
                <SelectItem key={f.id}>{f.name}</SelectItem>
              ))}
            </Select>
            <DatePicker
              size="sm"
              label="Start Date & Time"
              granularity="minute"
              variant="bordered"
              value={toCalendarDateTime(newGame.start_time)}
              onChange={(val) =>
                setNewGame({
                  ...newGame,
                  start_time: val ? val.toString() : "",
                })
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              type="submit"
              color="primary"
              isLoading={gameSaving}
            >
              Schedule Game
            </Button>
          </div>
        </form>

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

"use client";

import { useEffect, useState, useCallback } from "react";
import { Button, Input } from "@heroui/react";
import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import type { GameWithJoins } from "@/lib/types/database";
import { DialogShell } from "@/components/admin/DialogShell";

export function ScoresDialog({
  tournamentId,
  gameTypeFilter,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
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

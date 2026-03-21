"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@heroui/react";
import { TrophyIcon } from "@heroicons/react/24/outline";
import type { GameWithJoins } from "@/lib/types/database";
import { DialogShell } from "@/components/admin/DialogShell";

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

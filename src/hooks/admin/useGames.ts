import { useEffect, useState, useCallback } from "react";
import type {
  Team,
  Field,
  GameWithJoins,
  GameType,
  GameStatus,
} from "@/lib/types/database";

interface GameForm {
  game_type: GameType;
  round_name: string;
  game_number: string;
  field_id: string;
  home_team_id: string;
  away_team_id: string;
  start_time: string;
}

const EMPTY_FORM: GameForm = {
  game_type: "pool",
  round_name: "",
  game_number: "",
  field_id: "",
  home_team_id: "",
  away_team_id: "",
  start_time: "",
};

export function useGames(tournamentId: string | null) {
  const [games, setGames] = useState<GameWithJoins[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  // New game form
  const [showNewGame, setShowNewGame] = useState(false);
  const [newGame, setNewGame] = useState<GameForm>({ ...EMPTY_FORM });
  const [gameSaving, setGameSaving] = useState(false);

  // Score entry
  const [scoringGameId, setScoringGameId] = useState<string | null>(null);
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");
  const [scoreSaving, setScoreSaving] = useState(false);
  const [actionGameId, setActionGameId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tournamentId) return;
    setLoading(true);
    const [gamesData, teamsData, fieldsData] = await Promise.all([
      fetch(`/api/admin/games?tournament_id=${tournamentId}`).then((r) =>
        r.json(),
      ),
      fetch(`/api/admin/teams?tournament_id=${tournamentId}`).then((r) =>
        r.json(),
      ),
      fetch(`/api/admin/fields?tournament_id=${tournamentId}`).then((r) =>
        r.json(),
      ),
    ]);
    setGames(Array.isArray(gamesData) ? gamesData : []);
    setTeams(Array.isArray(teamsData) ? teamsData : []);
    setFields(Array.isArray(fieldsData) ? fieldsData : []);
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateGame(e: React.FormEvent) {
    e.preventDefault();
    setGameSaving(true);
    await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournament_id: tournamentId,
        game_type: newGame.game_type,
        round_name: newGame.round_name || null,
        game_number: newGame.game_number ? parseInt(newGame.game_number) : null,
        field_id: newGame.field_id || null,
        home_team_id: newGame.home_team_id || null,
        away_team_id: newGame.away_team_id || null,
        start_time: newGame.start_time || null,
        status: "scheduled",
      }),
    });
    setGameSaving(false);
    // Preserve round_name and auto-increment game_number for batch creation
    setNewGame({
      ...EMPTY_FORM,
      game_type: newGame.game_type,
      round_name: newGame.round_name,
      game_number: newGame.game_number
        ? String(parseInt(newGame.game_number) + 1)
        : "",
    });
    load();
  }

  function openScoreEntry(game: GameWithJoins) {
    setScoringGameId(game.id);
    setScoreHome(game.home_score?.toString() ?? "");
    setScoreAway(game.away_score?.toString() ?? "");
  }

  async function submitScore(notes?: string) {
    if (!scoringGameId) return;
    setScoreSaving(true);
    await fetch("/api/admin/games/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_id: scoringGameId,
        home_score: parseInt(scoreHome),
        away_score: parseInt(scoreAway),
        ...(notes ? { notes } : {}),
      }),
    });
    setScoreSaving(false);
    setScoringGameId(null);
    load();
  }

  async function updateGameStatus(gameId: string, status: GameStatus) {
    setActionGameId(gameId);
    await fetch("/api/admin/games", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: gameId, status }),
    });
    setActionGameId(null);
    load();
  }

  async function reopenGame(gameId: string) {
    setActionGameId(gameId);
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
    setActionGameId(null);
    load();
  }

  async function deleteGame(gameId: string) {
    if (!confirm("Delete this game? This cannot be undone.")) return;
    setActionGameId(gameId);
    await fetch(`/api/admin/games?id=${gameId}`, { method: "DELETE" });
    setActionGameId(null);
    load();
  }

  async function generateBracket() {
    const bracketExists = games.some(
      (g) => g.game_type === "bracket" || g.game_type === "championship",
    );
    if (
      bracketExists &&
      !confirm(
        "Re-generating will delete all existing bracket and championship games. Continue?",
      )
    ) {
      return null;
    }
    const res = await fetch("/api/admin/games/bracket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tournament_id: tournamentId }),
    });
    load();
    if (res.ok) return res.json();
    return null;
  }

  // Computed
  const poolGames = games.filter((g) => g.game_type === "pool");
  const pendingPoolGames = poolGames.filter(
    (g) =>
      g.status !== "final" &&
      g.status !== "forfeit" &&
      g.status !== "cancelled",
  );
  const allPoolGamesFinal =
    poolGames.length > 0 && pendingPoolGames.length === 0;
  const bracketExists = games.some(
    (g) => g.game_type === "bracket" || g.game_type === "championship",
  );

  return {
    games,
    teams,
    fields,
    loading,
    // New game
    showNewGame,
    setShowNewGame,
    newGame,
    setNewGame,
    gameSaving,
    handleCreateGame,
    // Score entry
    scoringGameId,
    setScoringGameId,
    scoreHome,
    setScoreHome,
    scoreAway,
    setScoreAway,
    scoreSaving,
    actionGameId,
    openScoreEntry,
    submitScore,
    // Game actions
    updateGameStatus,
    reopenGame,
    deleteGame,
    generateBracket,
    // Computed
    poolGames,
    pendingPoolGames,
    allPoolGamesFinal,
    bracketExists,
    reload: load,
  };
}

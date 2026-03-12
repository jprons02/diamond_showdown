"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Tournament,
  Game,
  GameWithJoins,
  Team,
  Field,
  GameStatus,
  GameType,
} from "@/lib/types/database";
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  ClockIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const GAME_STATUS_COLORS: Record<GameStatus, string> = {
  scheduled: "bg-white/5 text-gray-400",
  in_progress: "bg-amber-400/10 text-amber-400",
  final: "bg-emerald-400/10 text-emerald-400",
  cancelled: "bg-red-400/10 text-red-400",
  forfeit: "bg-red-400/10 text-red-400",
};

export default function GamesPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [games, setGames] = useState<GameWithJoins[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Score entry
  const [scoringGameId, setScoringGameId] = useState<string | null>(null);
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");
  const [scoreNotes, setScoreNotes] = useState("");
  const [scoreSaving, setScoreSaving] = useState(false);

  // New game form
  const [showNewGame, setShowNewGame] = useState(false);
  const [newGame, setNewGame] = useState({
    game_type: "pool" as GameType,
    round_name: "",
    game_number: "",
    field_id: "",
    home_team_id: "",
    away_team_id: "",
    start_time: "",
  });
  const [gameSaving, setGameSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadTournaments() {
      const { data } = await supabase
        .from("tournaments")
        .select("*")
        .order("event_date", { ascending: false });
      const list = data ?? [];
      setTournaments(list);
      if (list.length > 0) {
        const active = list.find(
          (t) => t.status === "open" || t.status === "closed",
        );
        setSelectedTournamentId(active?.id ?? list[0].id);
      }
      setLoading(false);
    }
    loadTournaments();
  }, [supabase]);

  const loadGames = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);

    const [gamesRes, teamsRes, fieldsRes] = await Promise.all([
      supabase
        .from("games")
        .select(
          "*, home_team:teams!games_home_team_id_fkey(*), away_team:teams!games_away_team_id_fkey(*), field:fields(*)",
        )
        .eq("tournament_id", selectedTournamentId)
        .order("game_number", { ascending: true }),
      supabase
        .from("teams")
        .select("*")
        .eq("tournament_id", selectedTournamentId)
        .order("seed", { ascending: true }),
      supabase
        .from("fields")
        .select("*")
        .eq("tournament_id", selectedTournamentId)
        .order("sort_order", { ascending: true }),
    ]);

    setGames((gamesRes.data as GameWithJoins[]) ?? []);
    setTeams(teamsRes.data ?? []);
    setFields(fieldsRes.data ?? []);
    setLoading(false);
  }, [supabase, selectedTournamentId]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // ─── Score Entry ──────────────────────────────────────────
  function openScoreEntry(game: Game) {
    setScoringGameId(game.id);
    setScoreHome(game.home_score?.toString() ?? "");
    setScoreAway(game.away_score?.toString() ?? "");
    setScoreNotes("");
  }

  async function submitScore() {
    if (!scoringGameId) return;
    setScoreSaving(true);

    const game = games.find((g) => g.id === scoringGameId);
    const homeScore = parseInt(scoreHome);
    const awayScore = parseInt(scoreAway);

    // Log score change if this was already scored
    if (game && (game.home_score !== null || game.away_score !== null)) {
      await supabase.from("score_audit_log").insert({
        game_id: scoringGameId,
        previous_home_score: game.home_score,
        previous_away_score: game.away_score,
        new_home_score: homeScore,
        new_away_score: awayScore,
        change_reason: scoreNotes || null,
      });
    }

    const winner_team_id =
      homeScore > awayScore ? game?.home_team_id : game?.away_team_id;
    const loser_team_id =
      homeScore > awayScore ? game?.away_team_id : game?.home_team_id;

    await supabase
      .from("games")
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: "final" as GameStatus,
        winner_team_id: homeScore !== awayScore ? winner_team_id : null,
        loser_team_id: homeScore !== awayScore ? loser_team_id : null,
        notes: scoreNotes || game?.notes || null,
      })
      .eq("id", scoringGameId);

    setScoreSaving(false);
    setScoringGameId(null);
    loadGames();
  }

  async function reopenGame(gameId: string) {
    await supabase
      .from("games")
      .update({
        status: "in_progress" as GameStatus,
        winner_team_id: null,
        loser_team_id: null,
      })
      .eq("id", gameId);
    loadGames();
  }

  async function updateGameStatus(gameId: string, status: GameStatus) {
    await supabase.from("games").update({ status }).eq("id", gameId);
    loadGames();
  }

  // ─── Create Game ──────────────────────────────────────────
  async function handleCreateGame(e: React.FormEvent) {
    e.preventDefault();
    setGameSaving(true);
    await supabase.from("games").insert({
      tournament_id: selectedTournamentId,
      game_type: newGame.game_type,
      round_name: newGame.round_name || null,
      game_number: newGame.game_number ? parseInt(newGame.game_number) : null,
      field_id: newGame.field_id || null,
      home_team_id: newGame.home_team_id || null,
      away_team_id: newGame.away_team_id || null,
      start_time: newGame.start_time || null,
      status: "scheduled" as GameStatus,
    });
    setGameSaving(false);
    setShowNewGame(false);
    setNewGame({
      game_type: "pool",
      round_name: "",
      game_number: "",
      field_id: "",
      home_team_id: "",
      away_team_id: "",
      start_time: "",
    });
    loadGames();
  }

  // Filtered games
  const filtered = games.filter(
    (g) => statusFilter === "all" || g.status === statusFilter,
  );

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Games & Scores</h1>
          <p className="text-gray-400 text-sm mt-1">
            Schedule games and enter scores
          </p>
        </div>
        <button
          onClick={() => setShowNewGame(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-4 h-4" />
          New Game
        </button>
      </div>

      {/* Tournament selector + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          className={inputCls + " sm:w-64"}
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-500" />
          <select
            className={inputCls + " sm:w-44"}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="final">Final</option>
            <option value="cancelled">Cancelled</option>
            <option value="forfeit">Forfeit</option>
          </select>
        </div>
      </div>

      {/* Games list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">No games found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((game) => {
            const isScoring = scoringGameId === game.id;
            return (
              <div
                key={game.id}
                className="rounded-2xl bg-brand-surface border border-white/5 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Game info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {game.game_number && (
                        <span className="text-xs text-gray-500">
                          #{game.game_number}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${GAME_STATUS_COLORS[game.status]}`}
                      >
                        {game.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-gray-600">
                        {game.game_type}{" "}
                        {game.round_name ? `• ${game.round_name}` : ""}
                      </span>
                    </div>

                    {/* Matchup */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 text-right">
                        <p className="text-white font-medium text-sm">
                          {game.home_team?.name ?? "TBD"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3">
                        {game.status === "final" || game.home_score !== null ? (
                          <span className="text-lg font-bold text-white">
                            {game.home_score ?? 0} – {game.away_score ?? 0}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">vs</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">
                          {game.away_team?.name ?? "TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      {game.field && <span>{game.field.name}</span>}
                      {game.start_time && (
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {new Date(game.start_time).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {game.status === "scheduled" && (
                      <button
                        onClick={() => updateGameStatus(game.id, "in_progress")}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors"
                      >
                        Start Game
                      </button>
                    )}
                    {(game.status === "in_progress" ||
                      game.status === "scheduled") && (
                      <button
                        onClick={() => openScoreEntry(game)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gradient-brand text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        Enter Score
                      </button>
                    )}
                    {game.status === "final" && (
                      <button
                        onClick={() => reopenGame(game.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ArrowPathIcon className="w-3 h-3" />
                        Reopen
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline score entry */}
                {isScoring && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                      <div className="flex-1 w-full sm:w-auto">
                        <label className={labelCls}>
                          {game.home_team?.name ?? "Home"} Score
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={inputCls}
                          value={scoreHome}
                          onChange={(e) => setScoreHome(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="flex-1 w-full sm:w-auto">
                        <label className={labelCls}>
                          {game.away_team?.name ?? "Away"} Score
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={inputCls}
                          value={scoreAway}
                          onChange={(e) => setScoreAway(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 w-full sm:w-auto">
                        <label className={labelCls}>Notes (optional)</label>
                        <input
                          className={inputCls}
                          value={scoreNotes}
                          onChange={(e) => setScoreNotes(e.target.value)}
                          placeholder="Correction reason, etc."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={submitScore}
                          disabled={scoreSaving || !scoreHome || !scoreAway}
                          className="p-2.5 rounded-xl bg-gradient-brand text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setScoringGameId(null)}
                          className="p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Game Modal */}
      {showNewGame && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowNewGame(false)}
          />
          <div className="relative bg-brand-surface border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                Schedule New Game
              </h2>
              <button
                onClick={() => setShowNewGame(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Game Type</label>
                  <select
                    className={inputCls}
                    value={newGame.game_type}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        game_type: e.target.value as GameType,
                      })
                    }
                  >
                    <option value="pool">Pool</option>
                    <option value="bracket">Bracket</option>
                    <option value="championship">Championship</option>
                    <option value="consolation">Consolation</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Game #</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={newGame.game_number}
                    onChange={(e) =>
                      setNewGame({ ...newGame, game_number: e.target.value })
                    }
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Round Name</label>
                <input
                  className={inputCls}
                  value={newGame.round_name}
                  onChange={(e) =>
                    setNewGame({ ...newGame, round_name: e.target.value })
                  }
                  placeholder="Pool Round 1, Semifinal, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Home Team</label>
                  <select
                    className={inputCls}
                    value={newGame.home_team_id}
                    onChange={(e) =>
                      setNewGame({ ...newGame, home_team_id: e.target.value })
                    }
                  >
                    <option value="">TBD</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Away Team</label>
                  <select
                    className={inputCls}
                    value={newGame.away_team_id}
                    onChange={(e) =>
                      setNewGame({ ...newGame, away_team_id: e.target.value })
                    }
                  >
                    <option value="">TBD</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Field</label>
                  <select
                    className={inputCls}
                    value={newGame.field_id}
                    onChange={(e) =>
                      setNewGame({ ...newGame, field_id: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Start Time</label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={newGame.start_time}
                    onChange={(e) =>
                      setNewGame({ ...newGame, start_time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewGame(false)}
                  className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={gameSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {gameSaving ? "Saving…" : "Schedule Game"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

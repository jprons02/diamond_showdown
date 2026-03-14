"use client";

import { useEffect, useState, useCallback } from "react";
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
  TrashIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const isDev = process.env.NODE_ENV === "development";
import {
  Select,
  SelectItem,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { TournamentSelector } from "@/components/admin/TournamentSelector";
import { RowSkeleton, SaveSpinner } from "@/components/admin/AdminLoading";

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
  const [actionGameId, setActionGameId] = useState<string | null>(null);

  // Bracket generation
  const [bracketGenerating, setBracketGenerating] = useState(false);
  const [bracketPopoverOpen, setBracketPopoverOpen] = useState(false);
  const [bracketPublishing, setBracketPublishing] = useState(false);

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

  useEffect(() => {
    async function loadTournaments() {
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
    loadTournaments();
  }, []);

  const loadGames = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);

    const [gamesData, teamsData, fieldsData] = await Promise.all([
      fetch(`/api/admin/games?tournament_id=${selectedTournamentId}`).then(
        (r) => r.json(),
      ),
      fetch(`/api/admin/teams?tournament_id=${selectedTournamentId}`).then(
        (r) => r.json(),
      ),
      fetch(`/api/admin/fields?tournament_id=${selectedTournamentId}`).then(
        (r) => r.json(),
      ),
    ]);

    setGames(Array.isArray(gamesData) ? gamesData : []);
    setTeams(Array.isArray(teamsData) ? teamsData : []);
    setFields(Array.isArray(fieldsData) ? fieldsData : []);
    setLoading(false);
  }, [selectedTournamentId]);

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
    await fetch("/api/admin/games/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_id: scoringGameId,
        home_score: parseInt(scoreHome),
        away_score: parseInt(scoreAway),
        notes: scoreNotes || null,
      }),
    });
    setScoreSaving(false);
    setScoringGameId(null);
    loadGames();
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
    loadGames();
  }

  async function updateGameStatus(gameId: string, status: GameStatus) {
    setActionGameId(gameId);
    await fetch("/api/admin/games", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: gameId, status }),
    });
    setActionGameId(null);
    loadGames();
  }

  async function deleteGame(gameId: string) {
    if (!confirm("Delete this game? This cannot be undone.")) return;
    setActionGameId(gameId);
    await fetch(`/api/admin/games?id=${gameId}`, { method: "DELETE" });
    setActionGameId(null);
    loadGames();
  }

  const selectedTournament =
    tournaments.find((t) => t.id === selectedTournamentId) ?? null;
  const bracketPublished = selectedTournament?.bracket_published ?? false;

  async function handlePublishBracket() {
    if (!selectedTournamentId) return;
    setBracketPublishing(true);
    await fetch("/api/admin/tournaments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedTournamentId,
        bracket_published: !bracketPublished,
      }),
    });
    // Refresh tournament list so bracketPublished reflects the new value
    const res = await fetch("/api/admin/tournaments");
    const list: Tournament[] = await res.json();
    setTournaments(Array.isArray(list) ? list : []);
    setBracketPublishing(false);
  }

  async function handleGenerateBracket() {
    if (!selectedTournamentId || !allPoolGamesFinal) return;
    if (
      bracketExists &&
      !confirm(
        "Re-generating will delete all existing bracket and championship games. Continue?",
      )
    )
      return;
    setBracketGenerating(true);
    await fetch("/api/admin/games/bracket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tournament_id: selectedTournamentId }),
    });
    setBracketGenerating(false);
    loadGames();
  }

  // ─── Create Game ──────────────────────────────────────────
  async function handleCreateGame(e: React.FormEvent) {
    e.preventDefault();
    setGameSaving(true);
    await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournament_id: selectedTournamentId,
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

  // Bracket helpers
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

  // Filtered games
  const filtered = games.filter(
    (g) => statusFilter === "all" || g.status === statusFilter,
  );

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";
  const selectCls = {
    trigger:
      "flex items-center bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8 h-[42px]",
    value: "text-white text-sm",
    popoverContent: "bg-brand-charcoal border border-white/10",
    listbox: "text-white",
    selectorIcon: "text-gray-400 shrink-0",
  };

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

      {/* ── Generate Bracket ───────────────────────────────────────── */}
      {selectedTournamentId && (
        <div
          className={`rounded-2xl border p-5 transition-all duration-300 ${
            allPoolGamesFinal
              ? "bg-brand-teal/5 border-brand-teal/30"
              : "bg-brand-surface border-white/5"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                allPoolGamesFinal ? "bg-gradient-brand" : "bg-white/5"
              }`}
            >
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-base font-bold text-white">
                  Generate Bracket
                </h2>
                {bracketExists && !bracketPublished && (
                  <Chip size="sm" color="success" variant="flat">
                    Bracket Generated
                  </Chip>
                )}
                {bracketExists && bracketPublished && (
                  <Chip
                    size="sm"
                    color="success"
                    variant="flat"
                    startContent={<EyeIcon className="w-3 h-3" />}
                  >
                    Published
                  </Chip>
                )}
                {allPoolGamesFinal && !bracketExists && (
                  <Chip size="sm" color="primary" variant="flat">
                    Ready
                  </Chip>
                )}
              </div>

              <p className="text-sm text-gray-400 mb-3">
                {poolGames.length === 0
                  ? "No pool games found. Add pool games first."
                  : allPoolGamesFinal
                    ? `All ${poolGames.length} pool games are final. Click to seed teams and build matchups.`
                    : `${pendingPoolGames.length} of ${poolGames.length} pool game${
                        poolGames.length !== 1 ? "s" : ""
                      } still need final scores.`}
              </p>

              {/* Seeding methodology */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Seeding:</span>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-white/5 text-gray-300"
                >
                  Win – Loss
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-white/5 text-gray-300"
                >
                  Run Differential
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-white/5 text-gray-300"
                >
                  Runs Scored
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  startContent=<SparklesIcon className="w-3 h-3" />
                  className="bg-amber-400/10 text-amber-400 border border-amber-400/20"
                >
                  Priority Seeding Rules: TBD
                </Chip>
              </div>
            </div>

            {/* Action buttons — stacked, vertically centered */}
            <div className="shrink-0 self-center flex flex-col items-stretch gap-2">
              {bracketExists && (
                <button
                  onClick={handlePublishBracket}
                  disabled={bracketPublishing}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    bracketPublished
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                      : "border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {bracketPublishing ? (
                    <SaveSpinner className="w-4 h-4" />
                  ) : bracketPublished ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                  {bracketPublished ? "Unpublish" : "Publish Bracket"}
                </button>
              )}

              {/* Generate button — popover when pool play is incomplete */}
              <div>
                {allPoolGamesFinal ? (
                  <button
                    onClick={handleGenerateBracket}
                    disabled={bracketGenerating}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-brand text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {bracketGenerating ? (
                      <SaveSpinner className="w-4 h-4" />
                    ) : (
                      <TrophyIcon className="w-4 h-4" />
                    )}
                    {bracketGenerating
                      ? "Generating…"
                      : bracketExists
                        ? "Re-generate Bracket"
                        : "Generate Bracket"}
                  </button>
                ) : (
                  <Popover
                    isOpen={bracketPopoverOpen}
                    onOpenChange={setBracketPopoverOpen}
                    placement="bottom-end"
                    showArrow
                  >
                    <PopoverTrigger>
                      <button
                        onClick={() => setBracketPopoverOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 text-gray-400 text-sm font-bold cursor-pointer hover:bg-white/8 transition-colors"
                      >
                        <TrophyIcon className="w-4 h-4" />
                        Generate Bracket
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-brand-charcoal border border-white/10 rounded-xl">
                      <div className="p-4 max-w-sm">
                        <p className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                          <ExclamationTriangleIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          Pool play is not complete
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          All pool games must be marked as{" "}
                          <span className="text-white font-medium">final</span>{" "}
                          before the bracket can be generated.
                          {pendingPoolGames.length > 0 &&
                            ` ${pendingPoolGames.length} game${
                              pendingPoolGames.length !== 1 ? "s" : ""
                            } still need scores.`}
                        </p>
                        {pendingPoolGames.length > 0 && (
                          <ul className="space-y-1.5">
                            {pendingPoolGames.slice(0, 6).map((g) => (
                              <li
                                key={g.id}
                                className="flex items-center gap-2 text-xs text-gray-400"
                              >
                                <span
                                  className={`px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                    GAME_STATUS_COLORS[g.status]
                                  }`}
                                >
                                  {g.status.replace("_", " ")}
                                </span>
                                <span className="truncate">
                                  {g.home_team?.name ?? "TBD"} vs{" "}
                                  {g.away_team?.name ?? "TBD"}
                                  {g.round_name ? ` · ${g.round_name}` : ""}
                                </span>
                              </li>
                            ))}
                            {pendingPoolGames.length > 6 && (
                              <li className="text-xs text-gray-500">
                                +{pendingPoolGames.length - 6} more
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            {/* end action buttons wrapper */}
          </div>
        </div>
      )}

      {/* Tournament selector + filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <TournamentSelector
          tournaments={tournaments}
          selectedId={selectedTournamentId}
          onChange={setSelectedTournamentId}
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            aria-label="Filter by status"
            variant="bordered"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) =>
              setStatusFilter(Array.from(keys)[0] as string)
            }
            className="w-full sm:w-44"
            classNames={selectCls}
          >
            <SelectItem key="all">All statuses</SelectItem>
            <SelectItem key="scheduled">Scheduled</SelectItem>
            <SelectItem key="in_progress">In Progress</SelectItem>
            <SelectItem key="final">Final</SelectItem>
            <SelectItem key="cancelled">Cancelled</SelectItem>
            <SelectItem key="forfeit">Forfeit</SelectItem>
          </Select>
        </div>
      </div>

      {/* Games list */}
      {loading ? (
        <RowSkeleton count={4} height="h-24" />
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
                        disabled={actionGameId === game.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors disabled:opacity-50"
                      >
                        {actionGameId === game.id ? (
                          <SaveSpinner className="w-3 h-3" />
                        ) : null}
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
                        disabled={actionGameId === game.id}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        {actionGameId === game.id ? (
                          <SaveSpinner className="w-3 h-3" />
                        ) : (
                          <ArrowPathIcon className="w-3 h-3" />
                        )}
                        Reopen
                      </button>
                    )}
                    {isDev && (
                      <button
                        onClick={() => deleteGame(game.id)}
                        disabled={actionGameId === game.id}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete game (dev only)"
                      >
                        <TrashIcon className="w-4 h-4" />
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
                          className="flex items-center justify-center p-2.5 rounded-xl bg-gradient-brand text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {scoreSaving ? (
                            <SaveSpinner className="w-5 h-5" />
                          ) : (
                            <CheckIcon className="w-5 h-5" />
                          )}
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
                  <Select
                    label="Game Type"
                    labelPlacement="outside"
                    variant="bordered"
                    selectedKeys={[newGame.game_type]}
                    onSelectionChange={(keys) =>
                      setNewGame({
                        ...newGame,
                        game_type: Array.from(keys)[0] as GameType,
                      })
                    }
                    classNames={selectCls}
                  >
                    <SelectItem key="pool">Pool</SelectItem>
                    <SelectItem key="bracket">Bracket</SelectItem>
                    <SelectItem key="championship">Championship</SelectItem>
                    <SelectItem key="consolation">Consolation</SelectItem>
                  </Select>
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
                  <Select
                    label="Home Team"
                    labelPlacement="outside"
                    variant="bordered"
                    items={[
                      { key: "__tbd", label: "TBD" },
                      ...teams.map((t) => ({ key: t.id, label: t.name })),
                    ]}
                    selectedKeys={
                      newGame.home_team_id ? [newGame.home_team_id] : ["__tbd"]
                    }
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0] as string;
                      setNewGame({
                        ...newGame,
                        home_team_id: val === "__tbd" ? "" : val,
                      });
                    }}
                    classNames={selectCls}
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
                <div>
                  <Select
                    label="Away Team"
                    labelPlacement="outside"
                    variant="bordered"
                    items={[
                      { key: "__tbd", label: "TBD" },
                      ...teams.map((t) => ({ key: t.id, label: t.name })),
                    ]}
                    selectedKeys={
                      newGame.away_team_id ? [newGame.away_team_id] : ["__tbd"]
                    }
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0] as string;
                      setNewGame({
                        ...newGame,
                        away_team_id: val === "__tbd" ? "" : val,
                      });
                    }}
                    classNames={selectCls}
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Field"
                    labelPlacement="outside"
                    variant="bordered"
                    items={[
                      { key: "__unassigned", label: "Unassigned" },
                      ...fields.map((f) => ({ key: f.id, label: f.name })),
                    ]}
                    selectedKeys={
                      newGame.field_id ? [newGame.field_id] : ["__unassigned"]
                    }
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0] as string;
                      setNewGame({
                        ...newGame,
                        field_id: val === "__unassigned" ? "" : val,
                      });
                    }}
                    classNames={selectCls}
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {gameSaving && <SaveSpinner className="w-4 h-4" />}
                  {gameSaving ? "Scheduling…" : "Schedule Game"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

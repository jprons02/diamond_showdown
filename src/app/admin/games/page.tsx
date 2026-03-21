"use client";

import { useEffect, useState, useCallback } from "react";
import type {
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
  Button,
  Input,
} from "@heroui/react";
import { DatePicker } from "@heroui/date-picker";
import { type CalendarDateTime } from "@internationalized/date";
import { useTournament } from "@/components/admin/TournamentContext";
import { RowSkeleton, SaveSpinner } from "@/components/admin/AdminLoading";
import { toCalendarDateTime } from "@/lib/utils/dateTime";
import { GAME_STATUS_COLORS } from "@/lib/constants/statusColors";

export default function GamesPage() {
  const {
    selectedId: selectedTournamentId,
    tournaments,
    selected: selectedTournament,
    refresh: refreshTournaments,
  } = useTournament();
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
    await refreshTournaments();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Games & Scores</h1>
          <p className="text-gray-400 text-sm mt-1">
            Schedule games and enter scores
          </p>
        </div>
        <Button
          color="primary"
          onPress={() => setShowNewGame(true)}
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          New Game
        </Button>
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
            <div className="shrink-0 self-start sm:self-center flex flex-col items-stretch gap-2">
              {bracketExists && (
                <Button
                  variant="bordered"
                  isLoading={bracketPublishing}
                  onPress={handlePublishBracket}
                  startContent={
                    !bracketPublishing ? (
                      bracketPublished ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )
                    ) : undefined
                  }
                  className={
                    bracketPublished
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                      : ""
                  }
                >
                  {bracketPublished ? "Unpublish" : "Publish Bracket"}
                </Button>
              )}

              {/* Generate button — popover when pool play is incomplete */}
              <div>
                {allPoolGamesFinal ? (
                  <Button
                    color="primary"
                    isLoading={bracketGenerating}
                    onPress={handleGenerateBracket}
                    startContent={
                      !bracketGenerating ? (
                        <TrophyIcon className="w-4 h-4" />
                      ) : undefined
                    }
                    className="font-bold"
                  >
                    {bracketGenerating
                      ? "Generating…"
                      : bracketExists
                        ? "Re-generate Bracket"
                        : "Generate Bracket"}
                  </Button>
                ) : (
                  <Popover
                    isOpen={bracketPopoverOpen}
                    onOpenChange={setBracketPopoverOpen}
                    placement="bottom-end"
                    showArrow
                  >
                    <PopoverTrigger>
                      <Button
                        variant="flat"
                        onPress={() => setBracketPopoverOpen(true)}
                        startContent={<TrophyIcon className="w-4 h-4" />}
                        className="font-bold"
                      >
                        Generate Bracket
                      </Button>
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

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            variant="bordered"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) =>
              setStatusFilter(Array.from(keys)[0] as string)
            }
            className="w-48"
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
                      <Button
                        size="sm"
                        variant="flat"
                        color="warning"
                        isLoading={actionGameId === game.id}
                        onPress={() => updateGameStatus(game.id, "in_progress")}
                      >
                        Start Game
                      </Button>
                    )}
                    {(game.status === "in_progress" ||
                      game.status === "scheduled") && (
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => openScoreEntry(game)}
                      >
                        Enter Score
                      </Button>
                    )}
                    {game.status === "final" && (
                      <Button
                        size="sm"
                        variant="light"
                        isLoading={actionGameId === game.id}
                        onPress={() => reopenGame(game.id)}
                        startContent={
                          actionGameId !== game.id ? (
                            <ArrowPathIcon className="w-3 h-3" />
                          ) : undefined
                        }
                      >
                        Reopen
                      </Button>
                    )}
                    {isDev && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        isDisabled={actionGameId === game.id}
                        onPress={() => deleteGame(game.id)}
                        title="Delete game (dev only)"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline score entry */}
                {isScoring && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                      <Input
                        label={`${game.home_team?.name ?? "Home"} Score`}
                        labelPlacement="outside"
                        variant="bordered"
                        type="number"
                        min={0}
                        value={scoreHome}
                        onValueChange={setScoreHome}
                        autoFocus
                        className="flex-1 w-full sm:w-auto"
                      />
                      <Input
                        label={`${game.away_team?.name ?? "Away"} Score`}
                        labelPlacement="outside"
                        variant="bordered"
                        type="number"
                        min={0}
                        value={scoreAway}
                        onValueChange={setScoreAway}
                        className="flex-1 w-full sm:w-auto"
                      />
                      <Input
                        label="Notes (optional)"
                        labelPlacement="outside"
                        variant="bordered"
                        value={scoreNotes}
                        onValueChange={setScoreNotes}
                        placeholder="Correction reason, etc."
                        className="flex-1 w-full sm:w-auto"
                      />
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          color="primary"
                          isLoading={scoreSaving}
                          isDisabled={!scoreHome || !scoreAway}
                          onPress={submitScore}
                        >
                          <CheckIcon className="w-5 h-5" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="bordered"
                          onPress={() => setScoringGameId(null)}
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </Button>
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
              <Button
                isIconOnly
                variant="light"
                onPress={() => setShowNewGame(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateGame} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Game Type"
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
                </div>
                <div>
                  <Input
                    label="Game #"
                    variant="bordered"
                    type="number"
                    value={newGame.game_number}
                    onValueChange={(val) =>
                      setNewGame({ ...newGame, game_number: val })
                    }
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Round Name"
                  variant="bordered"
                  value={newGame.round_name}
                  onValueChange={(val) =>
                    setNewGame({ ...newGame, round_name: val })
                  }
                  placeholder="Pool Round 1, Semifinal, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Home Team"
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
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
                <div>
                  <Select
                    label="Away Team"
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
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Field"
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
                  >
                    {(item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                </div>
                <div>
                  <DatePicker
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
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="bordered"
                  onPress={() => setShowNewGame(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" isLoading={gameSaving}>
                  {gameSaving ? "Scheduling…" : "Schedule Game"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

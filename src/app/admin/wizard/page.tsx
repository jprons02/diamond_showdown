"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { WizardStep } from "@/app/api/admin/wizard/route";
import { useTournament } from "@/components/admin/TournamentContext";
import { RowSkeleton } from "@/components/admin/AdminLoading";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import {
  EllipsisHorizontalCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  FieldsDialog,
  StatusChangeDialog,
  RegistrationsDialog,
  TeamsDialog,
  DraftDialog,
  ScheduleGamesDialog,
  CheckInDialog,
  ScoresDialog,
  GenerateBracketDialog,
  PublishBracketDialog,
} from "@/components/admin/dialogs";

const phaseColors: Record<
  string,
  { border: string; text: string; bg: string }
> = {
  Setup: {
    border: "border-purple-500/30",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  Registration: {
    border: "border-blue-500/30",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  "Draft Prep": {
    border: "border-amber-500/30",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  Scheduling: {
    border: "border-orange-500/30",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  "Tournament Day": {
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  Bracket: {
    border: "border-brand-teal/30",
    text: "text-brand-teal",
    bg: "bg-brand-teal/10",
  },
  "Wrap-Up": {
    border: "border-rose-500/30",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
  },
};

function StepIcon({ status }: { status: WizardStep["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircleIcon className="w-6 h-6 text-emerald-400" />;
    case "current":
      return (
        <EllipsisHorizontalCircleIcon className="w-6 h-6 text-brand-teal animate-pulse" />
      );
    case "upcoming":
      return <MinusCircleIcon className="w-6 h-6 text-gray-600" />;
  }
}

export default function WizardPage() {
  const {
    selectedId,
    selected: selectedTournament,
    tournaments,
    loading,
    refresh: refreshTournaments,
  } = useTournament();
  const [steps, setSteps] = useState<WizardStep[]>([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Load wizard steps when tournament changes
  const loadSteps = useCallback(async () => {
    if (!selectedId) {
      setSteps([]);
      return;
    }
    setStepsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/wizard?tournament_id=${encodeURIComponent(selectedId)}`,
      );
      if (!res.ok) throw new Error("Failed to load wizard data");
      const { steps: s } = await res.json();
      setSteps(s);
    } catch (err) {
      console.error("Failed to load wizard:", err);
      setSteps([]);
    } finally {
      setStepsLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

  // Refresh both tournaments and steps after a dialog action
  function handleDataChange() {
    refreshTournaments();
    loadSteps();
  }

  function closeDialog() {
    setOpenDialog(null);
  }

  // Group steps by phase
  const phases: { name: string; steps: WizardStep[] }[] = [];
  for (const step of steps) {
    const last = phases[phases.length - 1];
    if (last && last.name === step.phase) {
      last.steps.push(step);
    } else {
      phases.push({ name: step.phase, steps: [step] });
    }
  }

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const currentStep = steps.find((s) => s.status === "current");
  const progress =
    steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  // Map step IDs to which dialog to open
  function handleStepClick(stepId: string) {
    // "create-tournament" just links to /admin/tournaments — it's always done
    if (stepId === "create-tournament") return;
    setOpenDialog(stepId);
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournament Wizard</h1>
          <p className="text-gray-400 text-sm mt-1">Loading...</p>
        </div>
        <RowSkeleton count={6} height="h-16" />
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournament Wizard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Step-by-step guide to running your tournament
          </p>
        </div>
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <ExclamationTriangleIcon className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-medium">No tournaments yet</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Create your first tournament to get started.
          </p>
          <Link
            href="/admin/tournaments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal/10 text-brand-teal text-sm font-medium hover:bg-brand-teal/20 transition-colors"
          >
            Go to Tournaments
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournament Wizard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Step-by-step guide &mdash; follow each phase to run your tournament
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white">Overall Progress</p>
              {currentStep && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Next up: {currentStep.title}
                </p>
              )}
              {!currentStep && progress === 100 && (
                <p className="text-xs text-emerald-400 mt-0.5">
                  All steps completed!
                </p>
              )}
            </div>
            <span className="text-sm font-bold text-white">
              {completedCount}/{steps.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-teal to-emerald-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      {stepsLoading ? (
        <RowSkeleton count={6} height="h-16" />
      ) : (
        <div className="space-y-8">
          {phases.map((phase) => {
            const colors = phaseColors[phase.name] ?? {
              border: "border-white/10",
              text: "text-gray-400",
              bg: "bg-white/5",
            };
            return (
              <div key={phase.name}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-widest ${colors.text}`}
                  >
                    {phase.name}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="space-y-2">
                  {phase.steps.map((step, idx) => (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-150 w-full text-left cursor-pointer ${
                        step.status === "current"
                          ? `${colors.border} ${colors.bg} border-2`
                          : step.status === "completed"
                            ? "border-white/5 bg-brand-surface hover:border-white/10"
                            : "border-white/5 bg-brand-surface/50 opacity-60 hover:opacity-80"
                      }`}
                    >
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center pt-0.5">
                        <StepIcon status={step.status} />
                        {idx < phase.steps.length - 1 && (
                          <div className="w-px h-full min-h-[12px] bg-white/5 mt-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium ${
                              step.status === "current"
                                ? "text-white"
                                : step.status === "completed"
                                  ? "text-gray-300"
                                  : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </p>
                          {step.status === "current" && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                            >
                              Next
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {step.description}
                        </p>
                        {step.details && (
                          <p
                            className={`text-xs mt-1 ${
                              step.status === "completed"
                                ? "text-emerald-400/70"
                                : step.status === "current"
                                  ? colors.text
                                  : "text-gray-600"
                            }`}
                          >
                            {step.details}
                          </p>
                        )}
                      </div>

                      {/* Action arrow */}
                      <ArrowRightIcon
                        className={`w-4 h-4 shrink-0 mt-1 transition-colors ${
                          step.status === "current"
                            ? `${colors.text} group-hover:text-white`
                            : "text-gray-600 group-hover:text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Step Dialogs ─────────────────────────────────────── */}
      {selectedId && selectedTournament && (
        <>
          {openDialog === "create-fields" && (
            <FieldsDialog
              tournamentId={selectedId}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "open-registration" && (
            <StatusChangeDialog
              tournament={selectedTournament}
              targetStatus="open"
              title="Open Registration"
              description='Setting the status to "open" makes the tournament visible and accepting registrations on the public site.'
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "registrations" && (
            <RegistrationsDialog
              tournamentId={selectedId}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "close-registration" && (
            <StatusChangeDialog
              tournament={selectedTournament}
              targetStatus="closed"
              title="Close Registration"
              description='Setting the status to "closed" stops accepting new registrations. The tournament remains active.'
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "create-teams" && (
            <TeamsDialog
              tournamentId={selectedId}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "run-draft" && (
            <DraftDialog
              tournamentId={selectedId}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "schedule-pool-games" && (
            <ScheduleGamesDialog
              tournamentId={selectedId}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "check-in" && (
            <CheckInDialog
              tournamentId={selectedId}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "pool-play-scores" && (
            <ScoresDialog
              tournamentId={selectedId}
              gameTypeFilter="pool"
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "generate-bracket" && (
            <GenerateBracketDialog
              tournamentId={selectedId}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "publish-bracket" && (
            <PublishBracketDialog
              tournament={selectedTournament}
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "bracket-play-scores" && (
            <ScoresDialog
              tournamentId={selectedId}
              gameTypeFilter="bracket"
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}

          {openDialog === "complete-tournament" && (
            <StatusChangeDialog
              tournament={selectedTournament}
              targetStatus="completed"
              title="Complete Tournament"
              description="Mark this tournament as completed. Results will be final."
              onClose={closeDialog}
              onDataChange={handleDataChange}
            />
          )}
        </>
      )}
    </div>
  );
}

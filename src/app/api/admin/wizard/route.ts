import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export type WizardStepStatus = "completed" | "current" | "upcoming";

export type WizardStep = {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: WizardStepStatus;
  href: string;
  details: string | null;
};

/** GET /api/admin/wizard?tournament_id=... */
export async function GET(req: NextRequest) {
  const tournamentId = req.nextUrl.searchParams.get("tournament_id");
  if (!tournamentId) {
    return NextResponse.json(
      { error: "tournament_id is required" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  // Fetch all data in parallel
  const [
    { data: tournament },
    { data: fields },
    { data: registrations },
    { data: teams },
    { data: teamPlayers },
    { data: games },
  ] = await Promise.all([
    supabase.from("tournaments").select("*").eq("id", tournamentId).single(),
    supabase.from("fields").select("id").eq("tournament_id", tournamentId),
    supabase
      .from("registrations")
      .select(
        "id, registration_status, payment_status, draft_eligible, check_in_status",
      )
      .eq("tournament_id", tournamentId),
    supabase.from("teams").select("id").eq("tournament_id", tournamentId),
    supabase
      .from("team_players")
      .select("id")
      .eq("tournament_id", tournamentId),
    supabase
      .from("games")
      .select("id, game_type, status")
      .eq("tournament_id", tournamentId),
  ]);

  if (!tournament) {
    return NextResponse.json(
      { error: "Tournament not found" },
      { status: 404 },
    );
  }

  const fieldCount = fields?.length ?? 0;
  const regCount = registrations?.length ?? 0;
  const paidRegs =
    registrations?.filter((r) => r.payment_status === "paid").length ?? 0;
  const draftEligible =
    registrations?.filter((r) => r.draft_eligible).length ?? 0;
  const checkedIn =
    registrations?.filter((r) => r.check_in_status === "checked_in").length ??
    0;
  const teamCount = teams?.length ?? 0;
  const teamPlayerCount = teamPlayers?.length ?? 0;
  const poolGames = games?.filter((g) => g.game_type === "pool") ?? [];
  const bracketGames =
    games?.filter(
      (g) =>
        g.game_type === "bracket" ||
        g.game_type === "championship" ||
        g.game_type === "consolation",
    ) ?? [];
  const finalPoolGames = poolGames.filter((g) => g.status === "final").length;
  const finalBracketGames = bracketGames.filter(
    (g) => g.status === "final",
  ).length;
  const totalGames = games?.length ?? 0;
  const totalFinal = games?.filter((g) => g.status === "final").length ?? 0;

  // Determine which step is the first incomplete one
  let foundCurrent = false;

  function stepStatus(isComplete: boolean): WizardStepStatus {
    if (isComplete) return "completed";
    if (!foundCurrent) {
      foundCurrent = true;
      return "current";
    }
    return "upcoming";
  }

  const steps: WizardStep[] = [
    {
      id: "create-tournament",
      phase: "Setup",
      title: "Create Tournament",
      description:
        "Create the tournament record with dates, fees, and format settings.",
      status: "completed", // If we're on this page, the tournament exists
      href: "/admin/tournaments",
      details: `"${tournament.name}" created`,
    },
    {
      id: "open-registration",
      phase: "Setup",
      title: "Open Registration",
      description: 'Set tournament status to "open" so players can register.',
      status: stepStatus(
        tournament.status === "open" ||
          tournament.status === "closed" ||
          tournament.status === "completed",
      ),
      href: "/admin/tournaments",
      details:
        tournament.status === "draft"
          ? 'Status is still "draft"'
          : `Status: "${tournament.status}"`,
    },
    {
      id: "registrations",
      phase: "Registration",
      title: "Manage Registrations",
      description:
        "Review sign-ups, confirm payments, and mark players draft-eligible.",
      status: stepStatus(paidRegs > 0),
      href: "/admin/registrations",
      details:
        regCount > 0
          ? `${regCount} registered, ${paidRegs} paid, ${draftEligible} draft-eligible`
          : null,
    },
    {
      id: "close-registration",
      phase: "Registration",
      title: "Close Registration",
      description:
        'Set tournament status to "closed" when the registration window ends.',
      status: stepStatus(
        tournament.status === "closed" || tournament.status === "completed",
      ),
      href: "/admin/tournaments",
      details:
        tournament.status === "open"
          ? "Registration is still open"
          : tournament.status === "draft"
            ? "Registration hasn't opened yet"
            : null,
    },
    {
      id: "create-teams",
      phase: "Draft Prep",
      title: "Create Teams",
      description:
        "Create teams with names, colors, seeds, and coach assignments.",
      status: stepStatus(teamCount > 0),
      href: "/admin/teams",
      details:
        teamCount > 0
          ? `${teamCount} team${teamCount !== 1 ? "s" : ""} created`
          : null,
    },
    {
      id: "run-draft",
      phase: "Draft Prep",
      title: "Run the Draft",
      description: "Assign draft-eligible players to teams.",
      status: stepStatus(teamPlayerCount > 0),
      href: "/admin/teams",
      details:
        teamPlayerCount > 0
          ? `${teamPlayerCount} player${teamPlayerCount !== 1 ? "s" : ""} assigned to teams`
          : draftEligible > 0
            ? `${draftEligible} player${draftEligible !== 1 ? "s" : ""} eligible for draft`
            : null,
    },
    {
      id: "create-fields",
      phase: "Scheduling",
      title: "Create Fields",
      description:
        "Add the physical fields/diamonds where games will be played.",
      status: stepStatus(fieldCount > 0),
      href: "/admin/fields",
      details:
        fieldCount > 0
          ? `${fieldCount} field${fieldCount !== 1 ? "s" : ""} created`
          : null,
    },
    {
      id: "schedule-pool-games",
      phase: "Scheduling",
      title: "Schedule Pool Play Games",
      description:
        "Manually create pool play game matchups with field and time assignments.",
      status: stepStatus(poolGames.length > 0),
      href: "/admin/games",
      details:
        poolGames.length > 0
          ? `${poolGames.length} pool game${poolGames.length !== 1 ? "s" : ""} scheduled`
          : null,
    },
    {
      id: "check-in",
      phase: "Tournament Day",
      title: "Player Check-In",
      description: "Mark players as arrived on tournament day.",
      status: stepStatus(checkedIn > 0),
      href: "/admin/check-in",
      details: checkedIn > 0 ? `${checkedIn} of ${regCount} checked in` : null,
    },
    {
      id: "pool-play-scores",
      phase: "Tournament Day",
      title: "Enter Pool Play Scores",
      description:
        "Mark games in progress and enter final scores as pool play games are completed.",
      status: stepStatus(
        finalPoolGames > 0 && finalPoolGames === poolGames.length,
      ),
      href: "/admin/games",
      details:
        poolGames.length > 0
          ? `${finalPoolGames} of ${poolGames.length} pool games completed`
          : null,
    },
    {
      id: "generate-bracket",
      phase: "Bracket",
      title: "Generate Bracket",
      description: "Generate bracket matchups from pool play standings.",
      status: stepStatus(bracketGames.length > 0),
      href: "/admin/games",
      details:
        bracketGames.length > 0
          ? `${bracketGames.length} bracket game${bracketGames.length !== 1 ? "s" : ""} created`
          : null,
    },
    {
      id: "publish-bracket",
      phase: "Bracket",
      title: "Publish Bracket",
      description:
        "Toggle bracket visibility so players can see the bracket on the public site.",
      status: stepStatus(tournament.bracket_published),
      href: "/admin/settings",
      details: tournament.bracket_published
        ? "Bracket is published"
        : "Bracket not yet published",
    },
    {
      id: "bracket-play-scores",
      phase: "Bracket",
      title: "Play Bracket Games",
      description:
        "Enter scores for bracket games until a champion is determined.",
      status: stepStatus(
        bracketGames.length > 0 && finalBracketGames === bracketGames.length,
      ),
      href: "/admin/games",
      details:
        bracketGames.length > 0
          ? `${finalBracketGames} of ${bracketGames.length} bracket games completed`
          : null,
    },
    {
      id: "complete-tournament",
      phase: "Wrap-Up",
      title: "Complete Tournament",
      description:
        'Set tournament status to "completed" and publish final standings.',
      status: stepStatus(tournament.status === "completed"),
      href: "/admin/settings",
      details:
        tournament.status === "completed"
          ? "Tournament completed!"
          : `${totalFinal} of ${totalGames} total games finalized`,
    },
  ];

  return NextResponse.json({ tournament, steps });
}

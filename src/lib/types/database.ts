/** Auto-generated TypeScript types matching the Supabase schema. */
// NOTE: Row types use `type` (not `interface`) so they satisfy
// Record<string, unknown> — required by @supabase/postgrest-js generics.

// ─── Enums / Literals ────────────────────────────────────────
export type TournamentStatus =
  | "draft"
  | "open"
  | "closed"
  | "completed"
  | "cancelled";
export type RegistrationStatus =
  | "pending"
  | "confirmed"
  | "waitlisted"
  | "cancelled"
  | "refunded"
  | "checked_in"
  | "no_show";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded";
export type PaymentRecordStatus = "pending" | "paid" | "failed" | "refunded";
export type GameType = "pool" | "bracket" | "championship" | "consolation";
export type GameStatus =
  | "scheduled"
  | "in_progress"
  | "final"
  | "cancelled"
  | "forfeit";
export type CheckInStatus = "not_arrived" | "checked_in" | "no_show";
export type AdminRole =
  | "super_admin"
  | "admin"
  | "scorekeeper"
  | "check_in"
  | "viewer";
export type PermissionLevel = "owner" | "admin" | "scorekeeper" | "viewer";
export type AnnouncementAudience = "all" | "players" | "coaches" | "admins";

// ─── Row Types (columns only — no joined data) ──────────────

export type Tournament = {
  id: string;
  name: string;
  slug: string;
  event_date: string | null;
  location_name: string | null;
  location_address: string | null;
  registration_open: string | null;
  registration_close: string | null;
  draft_datetime: string | null;
  max_players: number | null;
  entry_fee: number | null;
  status: TournamentStatus;
  rules_text: string | null;
  standings_visible: boolean;
  bracket_published: boolean;
  scores_live: boolean;
  created_at: string;
  updated_at: string;
};

export type Player = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  skill_rating: number | null;
  preferred_position: string | null;
  throws: string | null;
  bats: string | null;
  shirt_size: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Registration = {
  id: string;
  tournament_id: string;
  player_id: string;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  paid_amount: number | null;
  draft_eligible: boolean;
  check_in_status: CheckInStatus | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  registration_id: string;
  provider: string;
  provider_payment_intent_id: string | null;
  provider_checkout_session_id: string | null;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  paid_at: string | null;
  refunded_at: string | null;
  raw_payload_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type Waiver = {
  id: string;
  registration_id: string;
  waiver_version: string | null;
  accepted: boolean;
  accepted_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  signature_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  tournament_id: string;
  name: string;
  seed: number | null;
  coach_assignment_type: string | null;
  coach_name: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
};

export type TeamPlayer = {
  id: string;
  tournament_id: string;
  team_id: string;
  registration_id: string;
  draft_pick_number: number | null;
  is_captain: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
};

export type Field = {
  id: string;
  tournament_id: string;
  name: string;
  sort_order: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Game = {
  id: string;
  tournament_id: string;
  game_type: GameType;
  round_name: string | null;
  game_number: number | null;
  field_id: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  winner_team_id: string | null;
  loser_team_id: string | null;
  start_time: string | null;
  end_time: string | null;
  home_score: number | null;
  away_score: number | null;
  status: GameStatus;
  bracket_position: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Admin = {
  id: string;
  auth_user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: AdminRole;
  created_at: string;
  updated_at: string;
};

export type TournamentAdmin = {
  id: string;
  tournament_id: string;
  admin_id: string;
  permission_level: PermissionLevel;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  tournament_id: string;
  title: string;
  body: string | null;
  audience: AnnouncementAudience;
  published_at: string | null;
  created_by_admin_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ScoreAuditLog = {
  id: string;
  game_id: string;
  changed_by_admin_id: string | null;
  previous_home_score: number | null;
  previous_away_score: number | null;
  new_home_score: number | null;
  new_away_score: number | null;
  change_reason: string | null;
  created_at: string;
};

// ─── Convenience types for queries with joins ────────────────
export type RegistrationWithPlayer = Registration & {
  player?: Player;
};

export type RegistrationWithJoins = Registration & {
  player?: Player;
  waiver?: Waiver | null;
};

export type TeamWithPlayers = Team & {
  team_players?: (TeamPlayer & {
    registration?: Registration & { player?: Player };
  })[];
};

export type GameWithJoins = Game & {
  home_team?: Team | null;
  away_team?: Team | null;
  winner_team?: Team | null;
  field?: Field | null;
};

// ─── Supabase Database helper type ──────────────────────────
// Minimal shape so the Supabase client generic works.
// Replace with `supabase gen types typescript` output for full type safety.

export type Database = {
  public: {
    Tables: {
      tournaments: {
        Row: Tournament;
        Insert: Partial<Tournament> & Pick<Tournament, "name" | "slug">;
        Update: Partial<Tournament>;
        Relationships: [];
      };
      players: {
        Row: Player;
        Insert: Partial<Player> &
          Pick<Player, "first_name" | "last_name" | "email">;
        Update: Partial<Player>;
        Relationships: [];
      };
      registrations: {
        Row: Registration;
        Insert: Partial<Registration> &
          Pick<Registration, "tournament_id" | "player_id">;
        Update: Partial<Registration>;
        Relationships: [];
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment> & Pick<Payment, "registration_id" | "amount">;
        Update: Partial<Payment>;
        Relationships: [];
      };
      waivers: {
        Row: Waiver;
        Insert: Partial<Waiver> & Pick<Waiver, "registration_id">;
        Update: Partial<Waiver>;
        Relationships: [];
      };
      teams: {
        Row: Team;
        Insert: Partial<Team> & Pick<Team, "tournament_id" | "name">;
        Update: Partial<Team>;
        Relationships: [];
      };
      team_players: {
        Row: TeamPlayer;
        Insert: Partial<TeamPlayer> &
          Pick<TeamPlayer, "tournament_id" | "team_id" | "registration_id">;
        Update: Partial<TeamPlayer>;
        Relationships: [];
      };
      fields: {
        Row: Field;
        Insert: Partial<Field> & Pick<Field, "tournament_id" | "name">;
        Update: Partial<Field>;
        Relationships: [];
      };
      games: {
        Row: Game;
        Insert: Partial<Game> & Pick<Game, "tournament_id">;
        Update: Partial<Game>;
        Relationships: [];
      };
      admins: {
        Row: Admin;
        Insert: Partial<Admin> &
          Pick<Admin, "first_name" | "last_name" | "email">;
        Update: Partial<Admin>;
        Relationships: [];
      };
      tournament_admins: {
        Row: TournamentAdmin;
        Insert: Partial<TournamentAdmin> &
          Pick<TournamentAdmin, "tournament_id" | "admin_id">;
        Update: Partial<TournamentAdmin>;
        Relationships: [];
      };
      announcements: {
        Row: Announcement;
        Insert: Partial<Announcement> &
          Pick<Announcement, "tournament_id" | "title">;
        Update: Partial<Announcement>;
        Relationships: [];
      };
      score_audit_log: {
        Row: ScoreAuditLog;
        Insert: Partial<ScoreAuditLog> & Pick<ScoreAuditLog, "game_id">;
        Update: Partial<ScoreAuditLog>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

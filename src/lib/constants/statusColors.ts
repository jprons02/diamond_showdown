import type {
  RegistrationStatus,
  PaymentStatus,
  GameStatus,
} from "@/lib/types/database";

export const REG_STATUS_COLORS: Record<RegistrationStatus, string> = {
  pending: "bg-amber-400/10 text-amber-400",
  confirmed: "bg-emerald-400/10 text-emerald-400",
  waitlisted: "bg-purple-400/10 text-purple-400",
  cancelled: "bg-red-400/10 text-red-400",
  refunded: "bg-gray-500/10 text-gray-400",
  checked_in: "bg-brand-teal/10 text-brand-teal",
  no_show: "bg-red-400/10 text-red-400",
};

export const PAY_STATUS_COLORS: Record<PaymentStatus, string> = {
  unpaid: "bg-red-400/10 text-red-400",
  pending: "bg-amber-400/10 text-amber-400",
  paid: "bg-emerald-400/10 text-emerald-400",
  refunded: "bg-gray-500/10 text-gray-400",
};

export const GAME_STATUS_COLORS: Record<GameStatus, string> = {
  scheduled: "bg-white/5 text-gray-400",
  in_progress: "bg-amber-400/10 text-amber-400",
  final: "bg-emerald-400/10 text-emerald-400",
  cancelled: "bg-red-400/10 text-red-400",
  forfeit: "bg-red-400/10 text-red-400",
};

export const CHECK_IN_COLORS: Record<string, string> = {
  checked_in: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  not_arrived: "bg-white/5 text-gray-400 border-white/5",
  no_show: "bg-red-400/10 text-red-400 border-red-400/20",
};

export const TEAM_COLORS = [
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Gold", value: "#F59E0B" },
  { label: "Green", value: "#22C55E" },
  { label: "Teal", value: "#0ED3CF" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Indigo", value: "#6366F1" },
  { label: "Purple", value: "#A855F7" },
  { label: "Pink", value: "#EC4899" },
  { label: "Slate", value: "#64748B" },
];

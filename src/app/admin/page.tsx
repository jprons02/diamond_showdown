import type { Metadata } from "next";
import Link from "next/link";
import { LockClosedIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Admin",
  description: "Diamond Showdown admin dashboard — coming soon.",
};

export default function AdminPage() {
  return (
    <div className="bg-gradient-dark min-h-[70vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-brand-teal/5 rounded-full blur-2xl" />
          </div>
          <div className="relative w-20 h-20 rounded-2xl bg-brand-surface border border-white/10 flex items-center justify-center mx-auto">
            <LockClosedIcon className="w-10 h-10 text-brand-teal" />
          </div>
        </div>

        {/* Content */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-widest mb-6">
          <WrenchScrewdriverIcon className="w-4 h-4" />
          Coming Soon
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 leading-relaxed mb-8">
          The admin dashboard is currently under development. Soon you&apos;ll be
          able to manage teams, brackets, schedules, and more — all from one
          place.
        </p>

        {/* Features preview */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            "Team Management",
            "Bracket Builder",
            "Schedule Editor",
            "Score Tracking",
            "Player Rosters",
            "Announcements",
          ].map((feature) => (
            <div
              key={feature}
              className="px-4 py-3 rounded-xl bg-brand-surface/50 border border-white/5 text-sm text-gray-400"
            >
              {feature}
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

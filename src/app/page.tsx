import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  TrophyIcon,
  BoltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const highlights = [
  {
    icon: TrophyIcon,
    title: "Competitive Play",
    description:
      "Double elimination format ensures every team gets a fair shot at the title.",
  },
  {
    icon: UserGroupIcon,
    title: "Teams & Free Agents",
    description:
      "Register as a full team or sign up as a free agent — we'll find you a squad.",
  },
  {
    icon: BoltIcon,
    title: "Action-Packed Weekend",
    description:
      "Three days of non-stop softball action with games, food, and community.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Fair & Organized",
    description:
      "Professional umpires, clear rules, and a well-organized tournament experience.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-teal/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-36">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-teal/20 rounded-3xl blur-2xl scale-150" />
                <Image
                  src="/logo.png"
                  alt={`${brand.name} Logo`}
                  width={200}
                  height={200}
                  className="relative rounded-2xl"
                  priority
                />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-white">Welcome to</span>
              <br />
              <span className="text-gradient">{brand.name}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {brand.tagline} The ultimate softball tournament experience —
              bring your best game, build lasting memories, and compete for
              glory.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Register Now
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="border-y border-white/5 bg-brand-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <CalendarDaysIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-semibold text-white">
                  {brand.tournament.date}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPinIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-semibold text-white">
                  {brand.tournament.location}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <UserGroupIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Format</p>
                <p className="font-semibold text-white">
                  {brand.tournament.format} — {brand.tournament.maxTeams} Teams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Why Play
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              What Makes Diamond Showdown Special
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="group relative p-6 rounded-2xl bg-brand-surface/50 border border-white/5 hover:border-brand-teal/30 transition-all duration-300 hover:bg-brand-surface"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center mb-5 group-hover:bg-brand-teal/20 transition-colors">
                  <item.icon className="w-6 h-6 text-brand-teal" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-10 sm:p-16 rounded-3xl bg-brand-surface border border-white/5 overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-brand-teal/10 blur-3xl rounded-full" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Compete?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Spots are limited to {brand.tournament.maxTeams} teams. Register
                your team today for {brand.tournament.teamFee} or sign up as a
                free agent for {brand.tournament.freeAgentFee}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Register Your Team
                </Link>
                <Link
                  href="/rules"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300 w-full sm:w-auto"
                >
                  View Rules
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import {
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "Official rules and regulations for the Diamond Showdown softball tournament.",
};

const sections = [
  {
    title: "Eligibility",
    rules: [
      "All players must be 18 years of age or older.",
      "Each team must have a minimum of 12 and a maximum of 15 rostered players.",
      "All players must be registered and on the official roster before their first game.",
      "Free agents will be assigned to teams at the discretion of tournament organizers.",
      "Players may only be rostered on one team for the duration of the tournament.",
    ],
  },
  {
    title: "Game Format",
    rules: [
      `The tournament follows a ${brand.tournament.format} bracket format.`,
      "Games are 7 innings or 1 hour and 15 minutes, whichever comes first.",
      "Championship game has no time limit.",
      "The home team is determined by a coin flip in pool play and by seeding in bracket play.",
      "Run rule: 15 runs after 3 innings, 10 runs after 5 innings.",
    ],
  },
  {
    title: "Gameplay Rules",
    rules: [
      "ASA/USA Softball rules apply unless otherwise stated.",
      "A designated hitter (DH) and extra hitter (EH) are permitted.",
      "Courtesy runners are allowed for the pitcher and catcher, using the last recorded out.",
      "Metal cleats are NOT allowed. Rubber cleats or turf shoes only.",
      "Each team is allowed one intentional walk per game by announcement.",
      "Infield fly rule is in effect.",
    ],
  },
  {
    title: "Equipment",
    rules: [
      "Game balls will be provided by the tournament (ASA-approved .52/300).",
      "Bats must be ASA/USA Softball certified. Altered bats result in immediate ejection.",
      "All batters must wear a batting helmet.",
      "Catchers must wear full protective gear including a mask, chest protector, and shin guards.",
    ],
  },
  {
    title: "Conduct & Sportsmanship",
    rules: [
      "Unsportsmanlike conduct will result in a warning, ejection, or team disqualification at umpire discretion.",
      "Arguing balls and strikes is not permitted and may result in ejection.",
      "Fighting or threatening behavior results in immediate ejection and possible tournament ban.",
      "Alcohol is not permitted in the dugout or on the playing field.",
      "Each team is responsible for cleaning their dugout after each game.",
    ],
  },
  {
    title: "Schedules & Logistics",
    rules: [
      "Game schedules will be posted at least 48 hours before the tournament begins.",
      "Teams must be ready to play 15 minutes before their scheduled game time.",
      "A team that is not ready within 10 minutes of game time will forfeit.",
      "Rainout policy: games may be shortened to 5 innings or rescheduled at organizer discretion.",
      "All decisions by tournament officials are final.",
    ],
  },
];

export default function RulesPage() {
  return (
    <div>
      {/* Hero */}
      <HeroBackground
        imageSrc="/Rules.jpg"
        imageAlt="Softball players making a play"
        overlayOpacity="bg-black/65"
        imagePosition="object-bottom"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4 animate-slide-up">
            Official Rules
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight animate-slide-up-delay">
            Tournament Rules &
            <span className="text-gradient-animated"> Regulations</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Please review all rules before registering. By participating in
            Diamond Showdown, all players and teams agree to abide by these
            rules.
          </p>
        </div>
      </HeroBackground>

      {/* Quick Info */}
      <section className="border-y border-white/5 bg-brand-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Game Length</p>
                <p className="font-semibold text-white text-sm">
                  7 innings / 1hr 15min
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Rule Set</p>
                <p className="font-semibold text-white text-sm">
                  ASA/USA Softball
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Run Rule</p>
                <p className="font-semibold text-white text-sm">
                  15 after 3 / 10 after 5
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Sections */}
      <section className="py-16 sm:py-24 bg-gradient-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <div
                key={section.title}
                className="p-6 sm:p-8 rounded-2xl bg-brand-surface/50 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal font-bold text-sm">
                    {idx + 1}
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.rules.map((rule, ruleIdx) => (
                    <li
                      key={ruleIdx}
                      className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500 mb-1">
                  Disclaimer
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Tournament organizers reserve the right to modify these rules
                  at any time. Any changes will be communicated to registered
                  teams prior to the start of the tournament. All decisions made
                  by tournament officials and umpires are final.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">
              Ready to play? Register your team or sign up as a free agent.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-105 transition-all duration-300"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

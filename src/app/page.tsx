import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import FloatingDiamonds from "@/components/FloatingDiamonds";
import StatsBar from "@/components/StatsBar";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  TrophyIcon,
  BoltIcon,
  ShieldCheckIcon,
  FireIcon,
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
    <div>
      {/* Hero Section with baseball field background */}
      <HeroBackground
        imageSrc="/hero.jpg"
        imageAlt="Softball diamond champs"
        overlayOpacity="bg-black/55"
        parallax
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 sm:pt-36 sm:pb-44">
          <div className="text-center">
            {/* Logo with glow */}
            <div className="flex justify-center mb-8 animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-teal/30 rounded-3xl blur-3xl scale-150 animate-pulse-glow" />
                <Image
                  src="/logo.png"
                  alt={`${brand.name} Logo`}
                  width={220}
                  height={220}
                  className="relative rounded-2xl drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 animate-slide-up-delay">
              <span className="text-white drop-shadow-lg">Welcome to</span>
              <br />
              <span className="text-gradient-animated">{brand.name}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up-delay-2 drop-shadow-md">
              {brand.tagline} The ultimate softball tournament experience —
              bring your best game, build lasting memories, and compete for
              glory.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/30 hover:shadow-brand-teal/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto glow-teal"
              >
                <FireIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Register Now
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 flex justify-center animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                <div className="w-1.5 h-3 bg-brand-teal rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </HeroBackground>

      {/* Stats Bar */}
      <section className="relative bg-brand-dark border-y border-white/5 -mt-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <StatsBar />
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-gradient-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <CalendarDaysIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-semibold text-white">
                  {brand.tournament.date}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <MapPinIcon className="w-6 h-6 text-brand-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-semibold text-white">
                  {brand.tournament.location}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
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
      <section className="relative py-20 sm:py-28 bg-gradient-dark overflow-hidden">
        <FloatingDiamonds />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="group relative p-6 rounded-2xl bg-brand-surface/50 border border-white/5 hover:border-brand-teal/30 transition-all duration-500 hover:bg-brand-surface hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-teal/10"
              >
                <div className="absolute inset-0 bg-brand-teal/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center mb-5 group-hover:bg-brand-teal/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-brand-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Strip */}
      <section className="relative py-16 overflow-hidden bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Game Day Vibes
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              This Is What It&apos;s All About
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                src: "/image1.jpg",
                alt: "Softball batter at the plate",
              },
              {
                src: "/image2.jpg",
                alt: "Baseball field under lights",
              },
              {
                src: "/image3.jpg",
                alt: "Team celebrating in dugout",
              },
              {
                src: "/image4.jpg",
                alt: "Softball glove and ball on field",
              },
            ].map((photo, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-brand-teal/0 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with background image */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=1920&q=80"
            alt="Baseball field from above"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-transparent to-brand-dark/80" />
          <div className="absolute inset-0 bg-noise opacity-20" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-10 sm:p-16 rounded-3xl bg-brand-surface/70 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Animated glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-brand-teal/15 blur-3xl rounded-full animate-pulse-glow" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-brand-teal/5 blur-3xl rounded-full" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-widest mb-6">
                <FireIcon className="w-4 h-4" />
                Limited Spots
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
                Ready to Compete?
              </h2>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto text-lg">
                Spots are limited to {brand.tournament.maxTeams} teams. Register
                your team today for {brand.tournament.teamFee} or sign up as a
                free agent for {brand.tournament.freeAgentFee}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/30 hover:shadow-brand-teal/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto animate-pulse-glow"
                >
                  Register Your Team
                </Link>
                <Link
                  href="/rules"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 w-full sm:w-auto"
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

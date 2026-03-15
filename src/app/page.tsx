import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import FloatingDiamonds from "@/components/FloatingDiamonds";
import RegisterButton from "@/components/RegisterButton";
import GlassButton from "@/components/GlassButton";
import {
  UserGroupIcon,
  TrophyIcon,
  BoltIcon,
  ShieldCheckIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    number: "1",
    icon: UserGroupIcon,
    title: "Register as a Free Agent",
    description:
      "Sign up solo — no team needed. Just show up ready to compete.",
  },
  {
    number: "2",
    icon: BoltIcon,
    title: "Live Draft Day",
    description:
      "Team captains pick their rosters in a live draft event before the tournament.",
  },
  {
    number: "3",
    icon: TrophyIcon,
    title: "Compete All Weekend",
    description:
      "Battle through a double elimination bracket over a full weekend of softball.",
  },
  {
    number: "4",
    icon: FireIcon,
    title: "Claim the Diamond",
    description:
      "One team earns the right to call themselves Diamond Showdown champions.",
  },
];

const highlights = [
  {
    icon: TrophyIcon,
    title: "Competitive Play",
    description:
      "Bracket-style competition designed to keep every team in the fight until the very end.",
  },
  {
    icon: UserGroupIcon,
    title: "Player Draft",
    description:
      "Everyone registers individually and gets drafted onto a team — no squad needed to sign up.",
  },
  {
    icon: BoltIcon,
    title: "Action-Packed Weekend",
    description:
      "Non-stop softball action packed with great games, good food, fun vibes.",
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
              <RegisterButton className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/30 hover:shadow-brand-teal/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto glow-teal">
                <FireIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Register Now
              </RegisterButton>
              <GlassButton
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </GlassButton>
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

      {/* CTA — dramatic full-width */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=1920&q=80"
            alt="Baseball field from above"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-brand-teal/5" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold uppercase tracking-widest mb-8">
            <FireIcon className="w-4 h-4" />
            Limited Spots Available
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-6">
            Ready to Compete?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-lg mx-auto">
            Spots are limited. Register as a free agent, get drafted onto a
            team, and compete for the title.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RegisterButton className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-brand rounded-2xl shadow-xl shadow-brand-teal/30 hover:shadow-brand-teal/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto glow-teal-lg">
              <FireIcon className="w-5 h-5 mr-2" />
              Register Now
            </RegisterButton>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import FloatingDiamonds from "@/components/FloatingDiamonds";
import {
  HeartIcon,
  SparklesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Diamond Showdown — the premier softball tournament bringing teams together for an unforgettable weekend of competition and community.",
};

const values = [
  {
    icon: HeartIcon,
    title: "Sportsmanship",
    description:
      "Respect for opponents, officials, and the game itself is at the heart of everything we do.",
  },
  {
    icon: SparklesIcon,
    title: "Competition",
    description:
      "We believe in fair, spirited competition that pushes every player to bring their best.",
  },
  {
    icon: UsersIcon,
    title: "Community",
    description:
      "More than a tournament — it's a gathering of athletes, families, and fans who share a love for the game.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <HeroBackground
        imageSrc="/About.jpg"
        imageAlt="Closeup of batting gloves"
        overlayOpacity="bg-black/60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-[460px] sm:h-[520px] flex flex-col items-center justify-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4 animate-slide-up">
            About Us
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight animate-slide-up-delay">
            The Story Behind the
            <span className="text-gradient-animated"> Showdown</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Diamond Showdown was born from a simple idea: bring together the
            best softball talent for a weekend of fierce competition, great
            energy, and unforgettable memories.
          </p>
        </div>
      </HeroBackground>

      {/* Mission Section */}
      <section className="relative py-16 sm:py-24 bg-gradient-dark overflow-hidden">
        <FloatingDiamonds />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-brand-teal/10 rounded-3xl blur-2xl" />
                <Image
                  src="/logo.png"
                  alt={`${brand.name} Logo`}
                  width={400}
                  height={400}
                  className="relative rounded-2xl mx-auto"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  We set out to create more than just another softball
                  tournament. Diamond Showdown is a{" "}
                  <span className="text-white font-medium">
                    premier competitive experience
                  </span>{" "}
                  designed from the ground up with players in mind.
                </p>
                <p>
                  From professional umpires to organized brackets, every detail
                  is carefully planned to ensure teams can focus on what matters
                  most — playing great softball.
                </p>
                <p>
                  Whether you&apos;re a seasoned team looking for your next
                  challenge or a free agent ready to prove yourself, Diamond
                  Showdown is your stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Our Values
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item) => (
              <div
                key={item.title}
                className="text-center p-8 rounded-2xl bg-brand-surface/50 border border-white/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-7 h-7 text-brand-teal" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

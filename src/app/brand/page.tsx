import type { Metadata } from "next";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { SwatchIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Brand Style Guide",
  description:
    "Diamond Showdown brand style guide — colors, typography, logo usage, and design guidelines.",
};

const colors = [
  {
    name: "Primary Teal",
    hex: brand.colors.primary,
    className: "bg-brand-teal",
    usage: "Primary buttons, links, accents, headings",
  },
  {
    name: "Teal Dark",
    hex: brand.colors.primaryDark,
    className: "bg-brand-teal-dark",
    usage: "Hover states, active indicators, gradients",
  },
  {
    name: "Teal Light",
    hex: brand.colors.primaryLight,
    className: "bg-brand-teal-light",
    usage: "Highlights, gradient endpoints, focus rings",
  },
  {
    name: "Background",
    hex: brand.colors.background,
    className: "bg-[#0F0F1A]",
    usage: "Page backgrounds, main canvas",
  },
  {
    name: "Surface",
    hex: brand.colors.surface,
    className: "bg-brand-surface",
    usage: "Cards, elevated surfaces, panels",
  },
  {
    name: "Charcoal",
    hex: brand.colors.charcoal,
    className: "bg-brand-charcoal",
    usage: "Secondary surfaces, borders, overlays",
  },
  {
    name: "White",
    hex: brand.colors.white,
    className: "bg-white",
    usage: "Primary text, headings on dark backgrounds",
  },
  {
    name: "Text Muted",
    hex: brand.colors.textMuted,
    className: "bg-[#94A3B8]",
    usage: "Secondary text, labels, placeholders",
  },
];

const gradients = [
  {
    name: "Brand Gradient",
    css: "linear-gradient(135deg, #0ED3CF 0%, #099E9B 100%)",
    className: "bg-gradient-brand",
    usage: "Primary CTAs, buttons, highlights",
  },
  {
    name: "Text Gradient",
    css: "linear-gradient(135deg, #0ED3CF 0%, #5EEAE6 50%, #0ED3CF 100%)",
    className: "text-gradient text-3xl font-bold",
    usage: "Hero headings, feature titles",
    isText: true,
  },
  {
    name: "Dark Gradient",
    css: "linear-gradient(180deg, #0F0F1A 0%, #16162A 50%, #1A1A2E 100%)",
    className: "bg-gradient-dark",
    usage: "Page backgrounds, sections",
  },
];

export default function BrandPage() {
  return (
    <div className="bg-gradient-dark">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-widest mb-6">
            <SwatchIcon className="w-4 h-4" />
            Design System
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Brand
            <span className="text-gradient"> Style Guide</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            The official design reference for Diamond Showdown. Use this guide
            to maintain visual consistency across all materials.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20">
        {/* Logo Section */}
        <section>
          <SectionHeader
            number="01"
            title="Logo"
            description="The Diamond Showdown logo is the primary brand mark. Always use the official logo file and maintain clear space around it."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo on dark */}
            <div className="p-10 rounded-2xl bg-brand-surface border border-white/5 flex flex-col items-center justify-center gap-6">
              <Image
                src="/logo.png"
                alt={`${brand.name} Logo`}
                width={200}
                height={200}
                className="rounded-xl"
              />
              <div className="text-center">
                <p className="text-sm font-medium text-white">On Dark Background</p>
                <p className="text-xs text-gray-500">Primary usage</p>
              </div>
            </div>
            {/* Logo guidelines */}
            <div className="p-8 rounded-2xl bg-brand-surface/50 border border-white/5 space-y-6">
              <h3 className="text-lg font-semibold text-white">Logo Guidelines</h3>
              <ul className="space-y-3">
                {[
                  "Always use the official logo files — never recreate or alter the logo.",
                  "Maintain minimum clear space equal to the height of the 'D' in Diamond around all sides.",
                  "Do not rotate, stretch, distort, or apply effects to the logo.",
                  "Do not place the logo on busy or low-contrast backgrounds.",
                  "Minimum display size: 40px height for digital, 0.5in for print.",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section>
          <SectionHeader
            number="02"
            title="Colors"
            description="Our color palette is built around a bold teal/cyan primary accent on deep dark backgrounds for a premium, modern feel."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div
                key={color.name}
                className="rounded-2xl overflow-hidden bg-brand-surface/50 border border-white/5"
              >
                <div
                  className={`h-24 ${color.className}`}
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-4">
                  <p className="font-semibold text-white text-sm">{color.name}</p>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    {color.hex}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gradients Section */}
        <section>
          <SectionHeader
            number="03"
            title="Gradients"
            description="Gradients are used sparingly to add depth and emphasis to key UI elements."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gradients.map((grad) => (
              <div
                key={grad.name}
                className="rounded-2xl overflow-hidden bg-brand-surface/50 border border-white/5"
              >
                <div
                  className={`h-28 flex items-center justify-center ${grad.className}`}
                  style={!grad.isText ? { background: grad.css } : undefined}
                >
                  {grad.isText && (
                    <span className={grad.className}>Diamond</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white text-sm">{grad.name}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1 break-all">
                    {grad.css}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{grad.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <SectionHeader
            number="04"
            title="Typography"
            description="We use Geist Sans as our primary typeface across all headings and body text for a clean, modern look."
          />
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Primary Font
                  </p>
                  <p className="text-3xl font-bold text-white">{brand.fonts.heading}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Used for headings, buttons, navigation, and body text.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Weights
                  </p>
                  <div className="space-y-2">
                    {[
                      { weight: "Regular", className: "font-normal" },
                      { weight: "Medium", className: "font-medium" },
                      { weight: "Semibold", className: "font-semibold" },
                      { weight: "Bold", className: "font-bold" },
                      { weight: "Extra Bold", className: "font-extrabold" },
                    ].map((item) => (
                      <p
                        key={item.weight}
                        className={`text-xl text-white ${item.className}`}
                      >
                        {item.weight} — The quick brown fox jumps over the lazy dog
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Type Scale */}
            <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-6">
                Type Scale
              </p>
              <div className="space-y-4">
                {[
                  { label: "H1", size: "text-5xl", weight: "font-extrabold" },
                  { label: "H2", size: "text-4xl", weight: "font-bold" },
                  { label: "H3", size: "text-3xl", weight: "font-bold" },
                  { label: "H4", size: "text-2xl", weight: "font-semibold" },
                  { label: "Body LG", size: "text-lg", weight: "font-normal" },
                  { label: "Body", size: "text-base", weight: "font-normal" },
                  { label: "Small", size: "text-sm", weight: "font-normal" },
                  { label: "XS", size: "text-xs", weight: "font-normal" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-baseline gap-4 py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-xs text-brand-teal font-mono w-16 flex-shrink-0">
                      {item.label}
                    </span>
                    <span className={`text-white ${item.size} ${item.weight}`}>
                      Diamond Showdown
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UI Components Section */}
        <section>
          <SectionHeader
            number="05"
            title="UI Components"
            description="Key interactive elements and their styling conventions."
          />
          <div className="space-y-6">
            {/* Buttons */}
            <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
              <p className="text-sm font-semibold text-white mb-6">Buttons</p>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-105 transition-all duration-300">
                  Primary Button
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300">
                  Secondary Button
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-brand-teal hover:text-brand-teal-light transition-colors">
                  Ghost Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
              <p className="text-sm font-semibold text-white mb-6">Cards</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
                  <p className="text-sm font-medium text-white">Default Card</p>
                  <p className="text-xs text-gray-500 mt-1">
                    bg-brand-surface/50 + border-white/5
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-surface border border-white/5 glow-teal">
                  <p className="text-sm font-medium text-white">Glow Card</p>
                  <p className="text-xs text-gray-500 mt-1">+ glow-teal shadow</p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-surface/50 border border-brand-teal/30">
                  <p className="text-sm font-medium text-white">Accent Border</p>
                  <p className="text-xs text-gray-500 mt-1">
                    border-brand-teal/30
                  </p>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
              <p className="text-sm font-semibold text-white mb-6">
                Form Inputs
              </p>
              <div className="max-w-sm space-y-4">
                <input
                  type="text"
                  defaultValue="Filled input"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Placeholder text"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Spacing & Borders */}
        <section>
          <SectionHeader
            number="06"
            title="Design Tokens"
            description="Consistent spacing, border radii, and effects used throughout the site."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
              <p className="text-sm font-semibold text-white mb-4">Border Radii</p>
              <div className="space-y-3">
                {[
                  { label: "xl (12px)", className: "rounded-xl", size: "w-16 h-16" },
                  { label: "2xl (16px)", className: "rounded-2xl", size: "w-16 h-16" },
                  { label: "3xl (24px)", className: "rounded-3xl", size: "w-16 h-16" },
                  { label: "full", className: "rounded-full", size: "w-16 h-16" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div
                      className={`${item.size} ${item.className} bg-brand-teal/20 border border-brand-teal/30 flex-shrink-0`}
                    />
                    <span className="text-sm font-mono text-gray-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
              <p className="text-sm font-semibold text-white mb-4">Effects</p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-brand-surface glow-teal">
                  <p className="text-sm font-medium text-white">Teal Glow</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">
                    box-shadow: 0 0 20px rgba(14,211,207,0.3)
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-brand-surface border-glow">
                  <p className="text-sm font-medium text-white">Border Glow</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">
                    border: 1px solid rgba(14,211,207,0.3)
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <p className="text-sm font-medium text-white">Glass Effect</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">
                    bg-white/5 + backdrop-blur-xl
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-mono text-brand-teal">{number}</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 text-sm max-w-2xl">{description}</p>
    </div>
  );
}

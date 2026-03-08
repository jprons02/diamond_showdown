import Image from "next/image";

interface HeroBackgroundProps {
  imageSrc: string;
  imageAlt: string;
  overlayOpacity?: string;
  imagePosition?: string;
  children: React.ReactNode;
}

/**
 * Full-bleed hero background with image, gradient overlay, and noise texture.
 * Uses Unsplash images for softball/baseball field photography.
 */
export default function HeroBackground({
  imageSrc,
  imageAlt,
  overlayOpacity = "bg-black/60",
  imagePosition = "object-center",
  children,
}: HeroBackgroundProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={`object-cover ${imagePosition}`}
          priority
          sizes="100vw"
        />
        {/* Dark gradient overlay */}
        <div className={`absolute inset-0 ${overlayOpacity}`} />
        {/* Bottom gradient fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F0F1A]" />
        {/* Teal accent overlay */}
        <div className="absolute inset-0 bg-brand-teal/5 mix-blend-overlay" />
        {/* Noise texture */}
        <div className="absolute inset-0 bg-noise opacity-30" />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-brand-teal-light/5 rounded-full blur-2xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative">{children}</div>
    </section>
  );
}

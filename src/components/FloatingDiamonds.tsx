/**
 * Animated diamond/teal floating particles for section backgrounds.
 */
export default function FloatingDiamonds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Diamond shapes */}
      <div className="absolute top-[10%] left-[5%] w-4 h-4 bg-brand-teal/20 rotate-45 animate-float" />
      <div className="absolute top-[20%] right-[10%] w-3 h-3 bg-brand-teal/15 rotate-45 animate-float-delay" />
      <div className="absolute top-[60%] left-[15%] w-2 h-2 bg-brand-teal/25 rotate-45 animate-float" />
      <div className="absolute top-[40%] right-[20%] w-5 h-5 bg-brand-teal/10 rotate-45 animate-float-delay" />
      <div className="absolute top-[75%] left-[60%] w-3 h-3 bg-brand-teal/15 rotate-45 animate-float" />
      <div className="absolute top-[85%] right-[30%] w-2 h-2 bg-brand-teal/20 rotate-45 animate-float-delay" />
      <div className="absolute top-[15%] left-[45%] w-2 h-2 bg-brand-teal-light/15 rotate-45 animate-float" />
      <div className="absolute top-[50%] right-[5%] w-4 h-4 bg-brand-teal/10 rotate-45 animate-float-delay" />

      {/* Glowing orbs */}
      <div className="absolute top-[30%] left-[70%] w-32 h-32 bg-brand-teal/5 rounded-full blur-2xl animate-pulse-glow" />
      <div className="absolute top-[70%] left-[20%] w-24 h-24 bg-brand-teal/5 rounded-full blur-xl animate-pulse-glow" />
    </div>
  );
}

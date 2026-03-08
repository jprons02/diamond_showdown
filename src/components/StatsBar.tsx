/**
 * Softball-themed stat counter cards with animated styling.
 */

const stats = [
  { value: "16", label: "Teams", suffix: "" },
  { value: "3", label: "Days", suffix: "" },
  { value: "$5K", label: "Prize Pool", suffix: "+" },
  { value: "200", label: "Athletes", suffix: "+" },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative group text-center p-6 rounded-2xl bg-brand-surface/50 border border-white/5 hover:border-brand-teal/30 transition-all duration-500 overflow-hidden"
        >
          {/* Hover glow */}
          <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <p className="text-3xl sm:text-4xl font-extrabold text-gradient-animated">
              {stat.value}
              {stat.suffix && (
                <span className="text-brand-teal">{stat.suffix}</span>
              )}
            </p>
            <p className="text-sm text-gray-400 mt-1 font-medium uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

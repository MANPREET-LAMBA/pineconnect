export default function Featurecard({ icon: Icon, title, dis }) {
  return (
    <div className="group relative p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.03]">

      {/* Icon */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 mb-4 sm:mb-5 md:mb-6">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-400 group-hover:text-purple-400 transition-all duration-300" />
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-3 group-hover:text-emerald-400 transition-all duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
        {dis}
      </p>

      {/* Subtle Hover Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 to-purple-500/0 group-hover:from-emerald-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}

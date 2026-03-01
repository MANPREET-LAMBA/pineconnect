import {
  ArrowTrendingUpIcon,
  ClockIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import Featurecard from "./Featurecard";

export default function Feature() {
  const data = [
    {
      icon: ArrowTrendingUpIcon,
      title: "Market Orders",
      dis: "Execute buy & sell positions instantly with ultra-low latency routing.",
    },
    {
      icon: ClockIcon,
      title: "Pending Orders",
      dis: "Advanced buy limit & sell limit logic with precision execution.",
    },
    {
      icon: ChartBarIcon,
      title: "Partial Close",
      dis: "Reduce exposure instantly while keeping your trade structure intact.",
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: "Target & Volume Control",
      dis: "Dynamic TP/SL management with volume-based precision control.",
    },
    {
      icon: Squares2X2Icon,
      title: "Pyramiding",
      dis: "Scale into positions strategically with multi-layered entries.",
    },
    {
      icon: ArrowPathIcon,
      title: "Close on Reverse",
      dis: "Automatically exit trades when market structure shifts direction.",
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-28 bg-[#0B0618] text-white overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 blur-[120px] rounded-full top-[-150px] sm:top-[-200px] right-[-150px] sm:right-[-200px]"></div>
      <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-emerald-500/10 blur-[120px] rounded-full bottom-[-120px] sm:bottom-[-150px] left-[-120px] sm:left-[-150px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug sm:leading-tight">
            We've built the tools,
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
              so you can focus on execution
            </span>
          </h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mx-auto">
            Professional trading infrastructure designed for speed, precision and scalability.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {data.map((item, index) => (
            <Featurecard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

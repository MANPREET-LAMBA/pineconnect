import "./landing.css";

export default function Horo() {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden text-white bg-black
                 pt-24 sm:pt-28 lg:pt-32" // Added padding to prevent navbar overlap
    >
      {/* Purple Glow */}
      <div className="absolute w-[600px] sm:w-[700px] h-[600px] sm:h-[700px] bg-purple-700/30 blur-[140px] rounded-full -top-40 -left-36 sm:-top-52 sm:-left-36"></div>

      {/* Indigo Glow */}
      <div className="absolute w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] bg-indigo-600/20 blur-[140px] rounded-full -bottom-48 -right-36 sm:-bottom-52 sm:-right-36"></div>

      {/* Emerald Accent Glow */}
      <div className="absolute w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-emerald-500/20 blur-[120px] rounded-full top-[40%] left-[25%] sm:top-[40%] sm:left-[30%]"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl w-full">
        {/* Small Badge */}
        <div className="mb-6 inline-block px-3 sm:px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-semibold">
          Ultra Low Latency Execution
        </div>

        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug sm:leading-tight bg-gradient-to-r from-white via-purple-400 to-indigo-500 bg-clip-text text-transparent">
          The Complete Trading Toolkit
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300 font-medium">
          Bridge, Copy Trading &{" "}
          <span className="text-emerald-400">Professional Account Manager</span>
        </p>

        <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
          Ultra-low latency TradingView bridge with integrated copy trading, advanced risk controls and institutional-grade execution.
        </p>

        {/* Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/10">
            Get Started
          </button>
          <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300">
            Explore Features
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="relative z-10 mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl px-2 sm:px-0">
        {[
          "Trusted by Prop Traders",
          "No Delays. No Missed Entries",
          "Built for Professional Trading",
          "1s Average Execution Time",
        ].map((text, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all duration-300"
          >
            <p className="font-semibold text-gray-200 text-sm sm:text-base">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

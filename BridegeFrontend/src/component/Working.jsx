import workingimg from "../assets/working.svg";

export default function Working() {
  return (
    <div className="py-16 sm:py-20 bg-black text-white px-6 overflow-hidden">
      
      {/* HEADER */}
      <div className="w-full flex flex-col items-center text-center">

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
          How it works
        </h1>

        <p className="pt-5 text-lg sm:text-xl lg:text-2xl tracking-wide text-gray-300 max-w-2xl">
          Automate your trading strategy in{" "}
          <span className="font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            3 simple steps
          </span>
        </p>

      </div>

      {/* CONTENT */}
      <div className="mt-14 grid lg:grid-cols-2 gap-14 items-center max-w-7xl mx-auto">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6">

          {/* STEP 1 */}
          <div className="w-full rounded-2xl bg-gradient-to-r from-transparent via-purple-900/40 to-purple-700/40 flex gap-5 p-5">

            <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-purple-500">
              1
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                Configure Alerts
              </h1>

              <p className="text-gray-300 text-sm sm:text-base lg:text-lg pt-2">
                Set up custom alerts in TradingView with conditions and
                parameters tailored to your strategy.
              </p>
            </div>

          </div>

          {/* STEP 2 */}
          <div className="w-full rounded-2xl bg-gradient-to-r from-transparent via-purple-900/40 to-purple-700/40 flex gap-5 p-5">

            <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-purple-500">
              2
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                Connect MetaTrader
              </h1>

              <p className="text-gray-300 text-sm sm:text-base lg:text-lg pt-2">
                Connect TradingView alerts bridge to MetaTrader 5 accounts
                in seconds.
              </p>
            </div>

          </div>

          {/* STEP 3 */}
          <div className="w-full rounded-2xl bg-gradient-to-r from-transparent via-purple-900/40 to-purple-700/40 flex gap-5 p-5">

            <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-purple-500">
              3
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                Execute Automatically
              </h1>

              <p className="text-gray-300 text-sm sm:text-base lg:text-lg pt-2">
                Trades are executed instantly with low latency and
                professional risk management.
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="relative  justify-center items-center hidden sm:flex">

          <div className="absolute w-[80%] h-[80%] bg-purple-700/20 blur-[120px] rounded-full"></div>

          <img
            src={workingimg}
            alt="Working"
            className="w-full max-w-lg relative z-10"
          />

        </div>

      </div>

    </div>
  );
}
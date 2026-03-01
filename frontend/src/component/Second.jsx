import logo from "../assets/pine.svg";

export default function Second() {
  const data = [
    {
      title: "Instant Signal Execution",
      dis: "Direct TradingView webhook integration with ultra-low latency order routing.",
    },
    {
      title: "Advanced Signal Engine",
      dis: "Precision-based signal filtering, routing and risk validation before execution.",
    },
    {
      title: "Copy Trading Infrastructure",
      dis: "Institutional-grade account replication & multi-account trade management.",
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-32 bg-black text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0B0618] to-black opacity-90"></div>

      {/* Glow */}
      <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-purple-600/10 blur-[120px] rounded-full top-[-120px] right-[-120px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* LEFT */}
        <div className="text-center lg:text-left">

          <span className="text-emerald-400 font-semibold tracking-widest text-xs sm:text-sm uppercase">
            Infrastructure
          </span>

          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Built for Speed.
            <br />
            <span className="text-purple-400">
              Designed for Scale.
            </span>
          </h2>

          <p className="mt-6 sm:mt-8 text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            A professional-grade trading infrastructure engineered to handle
            high-frequency execution, multi-account management and advanced
            automation workflows.
          </p>

          <div className="mt-8 sm:mt-10 flex justify-center lg:justify-start">
            <button className="px-6 sm:px-8 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-all duration-300">
              Explore Infrastructure
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4 sm:space-y-10">
          {data.map((item, index) => (
            <div
              key={index}
              className="
              group
              sm:border-b sm:border-white/10
              sm:pb-8
              p-[1px]
              rounded-xl
              bg-gradient-to-r
              from-purple-500/50
              to-emerald-500/50
              sm:bg-none
              "
            >
              <div
                className="
                flex items-start gap-4 sm:gap-6
                rounded-xl
                bg-[#111]
                sm:bg-transparent
                p-4 sm:p-0
                transition-all duration-300
                group-hover:bg-[#161616] sm:group-hover:bg-transparent
                "
              >

                {/* Icon */}
                <div
                  className="
                  min-w-[40px] min-h-[40px]
                  sm:w-12 sm:h-12
                  flex items-center justify-center
                  rounded-lg
                  bg-gradient-to-br
                  from-purple-500/30
                  to-emerald-500/30
                  sm:bg-white/5
                  border border-white/10
                  group-hover:border-purple-400
                  transition-all duration-300
                  "
                >
                  <img src={logo} alt="icon" className="w-5 sm:w-6 opacity-90" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold group-hover:text-purple-400 transition-all duration-300">
                    {item.title}
                  </h3>

                  <p className="mt-2 sm:mt-3 text-gray-400 text-sm sm:text-base leading-relaxed">
                    {item.dis}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
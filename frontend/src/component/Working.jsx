import workingimg from "../assets/working.svg"
export default function Working() {
  return (
    <div className="pt-5 ">
      <div className="w-full flex flex-col items-center justify-center ">
        <h1 className="text-7xl font-bold">How it works</h1>
        <p className="pt-6 text-2xl tracking-wider">
          Automate your trading strategy in 3 simple steps
        </p>
      </div>
      <div>
        <div className=" pt-10 flex ">
          <div className=" pl-[10%] flex flex-col gap-6 w-[35%] my-auto ">
            <div className="w-full  rounded-2xl  bg-gradient-to-r  from-transparent via-pink-4800 to-[rgb(128,49,173)] flex gap-5  h-fit p-3">
                <div className="text-8xl font-bold">
                    <h1>1</h1>
                </div>
              <div>
                <h1 className="text-4xl font-semibold">Configure Alerts</h1>
                <p className="text-xl tracking-wide pt-3">
                  Set up custom alerts in TradingView with conditions and
                  parameters tailored to your strategy.
                </p>
              </div>
            </div>
            <div className="w-full rounded-2xl bg-gradient-to-r from-transparent via-pink-4800 to-[rgb(128,49,173)] flex gap-5 h-fit p-3">
                <div className="text-8xl font-bold">
                    <h1>
                        2
                    </h1>
                </div>
              <div>
                <h1 className="text-4xl font-semibold">Connect MetaTrader</h1>
              <p className="text-xl tracking-wide pt-3">
                Connect the tradingView alerts bridge to MetaTrader 5 accounts
                in seconds.
              </p>
              </div>
            </div>
          </div>
          <div className="w-[60%]">
            <img src={workingimg}></img>
          </div>
        </div>
      </div>
    </div>
  );
}

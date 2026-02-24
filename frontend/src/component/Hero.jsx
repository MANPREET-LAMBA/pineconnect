import './landing.css'
import bg from "../assets/object1.svg"
import element from "../assets/element.png"

export default function Horo() {
  return (
    <div className="  relative w-full h-screen flex  items-center flex-col px-14 ">
      <div className='w-full absolute -top-28 h-full opacity-50 xl:opacity-35 -z-10 flex justify-center  '> <img className='w-[70%] ' src={bg} /></div>
      {/* <div className='w-full absolute -top-16 h-full  -z-20 flex justify-center items-center '> <img className='w-[100%] h-[100%]' src={element} /></div> */}

      <div className="linear-gradient(135deg,#12081F 0%,#2A0E4F 45%,#5B21B6 100%)">

      </div>
      <div className="w-[80%] relative text-3xl flex flex-col mt-44 items-center z-10  ">
        <h1 className="text-6xl glow h-fit pb-5  font-extrabold flex text-center bg-gradient-to-r from-white via-purple-500 to-violet-600 bg-clip-text ">
          The Complete Trading Toolkit:
          <br /> Bridge, Copy Trading & Account Manager
        </h1>
         <h1 className="  text-6xl absolute h-fit pb-5 text-transparent  font-extrabold flex text-center bg-gradient-to-r from-white via-purple-500 to-violet-500 bg-clip-text ">
          The Complete Trading Toolkit:
          <br /> Bridge, Copy Trading & Account Manager
        </h1>
        <h2 className="text-2xl text-center pt-10 text-white font-semibold font-sans">
          An ultra-low latency TradingView bridge with integrated copy trading,{" "}
          <br />
          advanced risk controls, and professional account management.
        </h2>
      </div>
      <div className="pt-6 text-blue-950 text-shadow-amber-50 z-10">
        <button className="w-fit p-3 font-bold rounded-xl bg-gradient-to-r from-white/85 to-purple-400 text-lg">Explore more and get freedom</button>
      </div>
{/* highlight points */}
      <div className="w-full flex justify-evenly font-bold pt-44">
        <div className="flex gap-2  p-3 rounded-xl bg-white/35">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 "
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>

          <h5>Trusted by prop trader </h5>
        </div>

        <div className="flex gap-2  p-3 rounded-xl bg-white/35">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>

          <h5>No delays. No missed entries</h5>
        </div>

        <div className="flex gap-2  p-3 rounded-xl bg-white/35">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
          <h5>Built for professional trading</h5>
        </div>

        <div className="flex gap-2  p-3 rounded-xl bg-white/35">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
          <h5>1s average execution time</h5>
        </div>
      </div>
    </div>
  );
}

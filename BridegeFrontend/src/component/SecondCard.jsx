import './landing.css'


export default function SecondCard({ url, heading, dis }) {
  return (
    <div className="relative w-96  rounded-xl p-[2px] overflow-hidden">

      {/* ROTATING BORDER ONLY */}
      <div className="absolute w-28 h-[150vw] top-1/2 left-1/2 rounded-xl bg-gradient-to-r from-purple-800 via-pink-4800 to-blue-900 animate-spin origin-top [animation-duration:8s] " />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-3xl" />

      {/* CONTENT (NO ROTATION) */}
      <div className="relative h-full rounded-xl bg-black/90 backdrop-blur-xl p-6 ">
        <div>
          <img className='w-full' src={url} alt="" />
          <h1>kemdk</h1>
        </div>

        <div>
          <h1>{heading}</h1>
          <p>{dis}</p>
        </div>

        <div>
          <button>Learn More</button>
        </div>
      </div>

    </div>
  )
}

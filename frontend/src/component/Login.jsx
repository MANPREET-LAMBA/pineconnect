export default function Login(){
    return(
        <div class="min-h-screen flex items-center justify-center  relative overflow-hidden">

 
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),transparent_60%)]"></div>

 
  <div class="relative z-10 w-full max-w-md rounded-2xl border border-white/10 
              bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">

    <h2 class="text-3xl font-semibold text-white text-center mb-2">
      Welcome Back
    </h2>
    <p class="text-gray-400 text-center mb-6">
      Login to manage your trading tools
    </p>

    <form class="space-y-5">
   
      <div>
        <label class="text-sm text-gray-400">Email</label>
        <input type="email" placeholder="you@email.com"
          class="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                 px-4 py-3 text-white outline-none focus:border-purple-500"/>
      </div>

      
      <div>
        <label class="text-sm text-gray-400">Password</label>
        <input type="password" placeholder="••••••••"
          class="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                 px-4 py-3 text-white outline-none focus:border-purple-500"/>
      </div>

      
      <button
        class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500
               py-3 text-white font-medium hover:opacity-90 transition">
        Login
      </button>
    </form>

    <p class="text-sm text-gray-400 text-center mt-6">
      Don’t have an account?
      <a href="/sign" class="text-purple-400 hover:underline">Sign up</a>
    </p>
  </div>
</div>

    )
}
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const navigate = useNavigate();

  useEffect(()=>{
  const response = async ()=>{
   try {
     const res =  await axios.get(
      "http://localhost:3000/api/checkauth",
      { withCredentials: true } ,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // console.log(res);
    
   } catch (error) {
    
    
   }
   
    
  }
 response()


  
},[])

const handleSubmit = async (e) => {
  e.preventDefault();


  try {
    const response = await axios.post(
      "http://localhost:3000/api/login",
      { email, password },
      { withCredentials: true } ,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    navigate("/")

    console.log(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center  relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),transparent_60%)]"></div>

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 
              bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Login to manage your trading tools
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500
               py-3 text-white font-medium hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?
          <a href="/sign" className="text-purple-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../FinalApi";

export default function Forget() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/forgot-password`,
        { email },
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Password reset link sent to your email!");
      console.log(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),transparent_60%)]"></div>

      {/* Card Wrapper */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 
              bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter your email address to receive a password reset link.
        </p>

        {/* Success/Error Alerts */}
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                   px-4 py-3 text-white outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500
               py-3 text-white font-medium hover:opacity-90 transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Footer Navigation Links */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Remembered your password?{" "}
          <button 
            // onClick={() => navigate("/login")} 
            className="text-purple-400 hover:underline bg-transparent border-none cursor-pointer"
            onClick={()=>{navigate("/reset")}}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
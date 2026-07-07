import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../FinalApi";

export default function VerifyAndResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // client-side validation check
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/reset-password-with-otp`,
        { email, otp, password },
        { 
          withCredentials: true,
          headers: { 
            "Content-Type": "application/json" 
          }
        }
      );

      setMessage("Password successfully reset! Redirecting to login...");
      console.log(response.data);

      // Smooth transition back to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP or request failed.");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),transparent_60%)]"></div>

      {/* Glassmorphic Container Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 
              bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-2">
          Reset Password
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter your verification code along with your new password credentials.
        </p>

        {/* Dynamic Alert Messages */}
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
          {/* Email field */}
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

          {/* OTP Input Field */}
          <div>
            <label className="text-sm text-gray-400">Verification Code (OTP)</label>
            <input
              type="text"
              required
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                   px-4 py-3 text-white text-center tracking-widest text-lg font-semibold outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* New Password input */}
          <div>
            <label className="text-sm text-gray-400">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                   px-4 py-3 text-white outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Confirm New Password input */}
          <div>
            <label className="text-sm text-gray-400">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                   px-4 py-3 text-white outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500
               py-3 text-white font-medium hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </form>

        {/* Back navigation fallbacks */}
        <p className="text-sm text-gray-400 text-center mt-6">
          <button 
            type="button"
            onClick={() => navigate("/login")} 
            className="text-purple-400 hover:underline bg-transparent border-none cursor-pointer"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
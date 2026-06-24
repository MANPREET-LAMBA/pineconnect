import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../Api";

export default function Sign() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    phone: "",
    password: "",
  });
const navigate = useNavigate();
  //   const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/newuser`,
        formData,
        { withCredentials: true }
      );
      console.log(res);

      console.log("done");

      setMessage("✅ Account created successfully");
      navigate("/portal")
    } catch (error) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05060f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(168,85,247,0.18),transparent_60%)]"></div>

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 
        bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-2">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Start automating your trades today
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              required
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Country</label>
            <input
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              placeholder="USA"
              required
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full mt-1 rounded-lg bg-black/40 border border-white/10 
                px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500
              py-3 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-300">{message}</p>
        )}

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

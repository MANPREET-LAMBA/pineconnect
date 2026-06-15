import { useState, useEffect } from "react";
import logo from "../assets/pine.svg";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Docs", path: "/document" },
    { name: "Pricing", path: "/#pricing" },
    { name: "DashBoard", path: "/portal" },
    { name: "Alogs", path: "https://pineconnect.vercel.app/" },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 px-4 sm:px-6 lg:px-8 py-3 flex justify-center">
      <div
        className={`flex items-center justify-between w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3 rounded-2xl transition-all duration-500
          ${scrolled
            ? "bg-[#0B0618]/90 backdrop-blur-xl border border-white/10 shadow-xl"
            : "bg-transparent"
          }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="PineConnect logo"
            className="w-10 sm:w-11 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-xl sm:text-2xl font-bold tracking-wide">
            Pine<span className="text-emerald-400">Connect</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10 text-lg font-medium">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <a
                href={item.path}
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {item.name}
              </a>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Buttons & Hamburger */}
        <div className="flex items-center gap-4">
          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4">
            <Link to="/login">
              <button className="px-6 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-emerald-400 transition-all duration-300">
                Login
              </button>
            </Link>
            <button className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600/45 to-emerald-500/45 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-900/40">
              Contact
            </button>
          </div>

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden text-gray-300 text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-screen w-64 bg-[#0B0618]/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 shadow-xl z-40
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          <ul className="flex flex-col gap-6 text-lg font-medium">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 mt-6">
            <Link to="/login">
              <button
                className="w-full px-6 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-emerald-400 transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </button>
            </Link>
            <button
              className="w-full px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600/45 to-emerald-500/45 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-900/40"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Overlay when menu open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </nav>
  );
}

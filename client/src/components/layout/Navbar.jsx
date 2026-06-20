import { Link, useLocation } from "react-router-dom";
import { FaFire } from "react-icons/fa";

function Navbar() {
  const location = useLocation();

  // Helper function to cleanly mark active pages with a subtle purple indicator dot/text glow
  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/40 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* 🚀 Premium Brand Logo Layout */}
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              <FaFire className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-200 transition-colors">
              HabitTracker
            </span>
          </Link>

          {/* 🔗 Minimalist Modern Route Options */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/")
                  ? "text-zinc-100 bg-zinc-900/60 border border-zinc-800/60 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/login"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/login")
                  ? "text-zinc-100 bg-zinc-900/60 border border-zinc-800/60 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30"
              }`}
            >
              Login
            </Link>

            {/* High-contrast Primary Button for Registration Calls-to-Action */}
            <Link
              to="/register"
              className="ml-2 px-4 py-2 h-9 rounded-xl text-sm font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 active:scale-95 transition-all duration-200 flex items-center shadow-lg shadow-white/5 whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
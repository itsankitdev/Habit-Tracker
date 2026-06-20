import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaChartBar, FaCheckCircle, FaCog,
  FaFire, FaSignOutAlt, FaBars, FaTimes, FaSun, FaMoon
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { getUser, clearUser } from "../../utils/auth";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
  { name: "Habits",    path: "/habits",    icon: <FaCheckCircle /> },
  { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
  { name: "Settings",  path: "/settings",  icon: <FaCog /> },
];

function Sidebar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === "dark";

  const user = getUser() || { name: "User", email: "" };
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "HT";

  const handleLogout = () => { clearUser(); navigate("/"); };

  // Theme-aware classes
  const bg       = isDark ? "bg-zinc-950"   : "bg-white/90 backdrop-blur-md";
  const border   = isDark ? "border-zinc-900" : "border-violet-100";
  const text     = isDark ? "text-zinc-100"  : "text-indigo-950";
  const subtext  = isDark ? "text-zinc-500"  : "text-violet-400";
  const mutedBtn = isDark
    ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60 border-transparent"
    : "text-violet-400 hover:text-indigo-900 hover:bg-violet-50 border-transparent";

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b ${border}`}>
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
          <FaFire className="text-white text-sm" />
        </div>
        <div>
          <h1 className={`text-sm font-bold ${text}`}>HabitTracker</h1>
          <p className={`text-[10px] uppercase tracking-widest mt-0.5 ${subtext}`}>Workspace</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 mt-1 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border
              ${isActive
                ? isDark
                  ? "text-zinc-100 bg-zinc-900 border-zinc-800"
                  : "text-indigo-900 bg-violet-100 border-violet-200 font-semibold"
                : mutedBtn
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-violet-500" />
                )}
                <span className={`text-sm leading-none ${isActive ? "text-violet-500" : subtext}`}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t ${border}`}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-1 cursor-pointer border ${mutedBtn}`}
        >
          {isDark
            ? <><FaSun className="text-amber-400 text-sm" /><span className="text-zinc-400">Light Mode</span></>
            : <><FaMoon className="text-violet-500 text-sm" /><span className="text-violet-500">Dark Mode</span></>
          }
          <div
            className="ml-auto rounded-full flex items-center px-0.5 transition-colors duration-200"
            style={{
              width: "36px", height: "20px",
              background: isDark ? "#7c3aed" : "#ddd6fe",
            }}
          >
            <div
              className="rounded-full bg-white shadow transition-transform duration-200"
              style={{
                width: "16px", height: "16px",
                transform: isDark ? "translateX(16px)" : "translateX(0px)",
              }}
            />
          </div>
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl mb-1">
          <div className={`w-7 h-7 rounded-full overflow-hidden border shrink-0 ${isDark ? "border-violet-500/30" : "border-violet-300"}`}>
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-violet-600/20" : "bg-violet-100"}`}>
                <span className="text-[10px] font-bold text-violet-500">{initials}</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-semibold truncate capitalize ${isDark ? "text-zinc-300" : "text-indigo-900"}`}>{user.name}</p>
            <p className={`text-[10px] truncate ${isDark ? "text-zinc-600" : "text-violet-400"}`}>{user.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b ${bg} ${border}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <FaFire className="text-white text-xs" />
          </div>
          <span className={`text-sm font-bold ${text}`}>HabitTracker</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors cursor-pointer">
            {isDark ? <FaSun className="text-amber-400" /> : <FaMoon className="text-violet-500" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-zinc-400 transition-colors">
            {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 border-r flex flex-col transform transition-transform duration-300 ${bg} ${border} ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <NavContent />
      </div>

      <aside className={`hidden lg:flex flex-col w-56 h-screen sticky top-0 border-r shrink-0 ${bg} ${border}`}>
        <NavContent />
      </aside>
    </>
  );
}

export default Sidebar;
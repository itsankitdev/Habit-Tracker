import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

function StatsCard({ title, value, icon, iconClassName = "bg-violet-500/10 border-violet-500/20 text-violet-500" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        isDark
          ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
          : "bg-white/80 border-violet-200 hover:border-violet-300 shadow-sm shadow-violet-100 backdrop-blur-sm"
      }`}
    >
      {icon && (
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-base shrink-0 ${iconClassName}`}>
          {icon}
        </div>
      )}
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-violet-400"}`}>{title}</p>
        <h2 className={`text-xl font-extrabold mt-0.5 ${isDark ? "text-zinc-100" : "text-indigo-950"}`}>{value}</h2>
      </div>
    </motion.div>
  );
}

export default StatsCard;
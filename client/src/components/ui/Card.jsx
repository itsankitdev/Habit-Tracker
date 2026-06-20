import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

function Card({ children, className = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`rounded-2xl border transition-all duration-200 ${
        isDark
          ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
          : "bg-white/80 border-violet-200 hover:border-violet-300 shadow-sm shadow-violet-100 backdrop-blur-sm"
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;